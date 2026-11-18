<#
.SYNOPSIS
  Read-only audit of the actual DiceBox Campaign Helper desktop launcher.
.DESCRIPTION
  Resolves the running workstation source and release EXE. Prints one JSON
  report without rebuilding, writing, stopping, replacing or executing the EXE.
  A matching source HEAD or file hash is NOT evidence of a current build.
  Requires the canonical writer to verify this receipt before release actions.
#>
[CmdletBinding()]
param(
  [string]$WorkstationRoot = (Join-Path $env:USERPROFILE 'Documents\Codex\DiceBox Campaign Helper\work\dch-workstation-layout-v001'),
  [ValidatePattern('^[0-9a-fA-F]{64}$')]
  [string]$ExpectedLauncherSha256
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$launcherRelative = 'apps\campaign-helper-desktop\src-tauri\target\release\dicebox-campaign-helper-desktop.exe'
$workstationMarkers = @(
  'apps\campaign-helper-desktop\src\ChatPanel.tsx',
  'apps\campaign-helper-desktop\src\SiwcConnectionPanel.tsx',
  'apps\campaign-helper-desktop\src\workspace-chat.ts',
  'apps\campaign-helper-desktop\src-tauri\src\siwc_direct_chat.rs',
  'apps\campaign-helper-desktop\src-tauri\src\siwc_accounts.rs'
)

function Invoke-GitReadOnly {
  param([string]$Root, [string[]]$Arguments)
  $lines = & git -C $Root @Arguments 2>$null
  if ($LASTEXITCODE -ne 0) { throw "Git read failed: $($Arguments[0])" }
  if ($null -eq $lines) { return }
  return $lines
}

$root = [System.IO.Path]::GetFullPath($WorkstationRoot)
$exe = Join-Path $root $launcherRelative
$observedAt = [DateTime]::UtcNow.ToString('o')
$warnings = New-Object 'System.Collections.Generic.List[string]'
$sourceExists = Test-Path -LiteralPath $root -PathType Container
$markerMissing = @()
$head = $null
$branch = $null
$trackedChanged = $null
$untrackedCount = $null

if (-not $sourceExists) {
  $warnings.Add('WORKSTATION_ROOT_NOT_FOUND')
} else {
  foreach ($rel in $workstationMarkers) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $rel) -PathType Leaf)) { $markerMissing += $rel }
  }
  if ($markerMissing.Count -gt 0) { $warnings.Add('WORKSTATION_MARKER_MISMATCH') }
  try {
    $head = @(Invoke-GitReadOnly -Root $root -Arguments @('rev-parse', 'HEAD'))[0]
    $branch = @(Invoke-GitReadOnly -Root $root -Arguments @('rev-parse', '--abbrev-ref', 'HEAD'))[0]
    $trackedChanged = @(Invoke-GitReadOnly -Root $root -Arguments @('status', '--porcelain=v1', '--untracked-files=no')).Count
    $untrackedCount = @(Invoke-GitReadOnly -Root $root -Arguments @('ls-files', '--others', '--exclude-standard')).Count
  } catch {
    $warnings.Add('WORKSTATION_GIT_READ_UNAVAILABLE')
  }
}

$exeExists = Test-Path -LiteralPath $exe -PathType Leaf
$exeHash = $null
$exeBytes = $null
$exeLastWriteUtc = $null
if ($exeExists) {
  try {
    $file = Get-Item -LiteralPath $exe
    $exeBytes = $file.Length
    $exeLastWriteUtc = $file.LastWriteTimeUtc.ToString('o')
    $exeHash = (Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash.ToLowerInvariant()
  } catch {
    $warnings.Add('LAUNCHER_READ_UNAVAILABLE')
  }
} else {
  $warnings.Add('LAUNCHER_NOT_FOUND')
}

$matchingProcessCount = $null
$otherPathProcessCount = $null
try {
  $procs = @(Get-CimInstance Win32_Process -Filter "Name='dicebox-campaign-helper-desktop.exe'" -ErrorAction Stop)
  $matchingProcessCount = 0
  $otherPathProcessCount = 0
  foreach ($p in $procs) {
    if ([string]::IsNullOrWhiteSpace($p.ExecutablePath)) {
      $warnings.Add('PROCESS_PATH_UNAVAILABLE')
    } elseif ([string]::Equals([System.IO.Path]::GetFullPath($p.ExecutablePath), $exe, [StringComparison]::OrdinalIgnoreCase)) {
      $matchingProcessCount++
    } else {
      $otherPathProcessCount++
    }
  }
} catch {
  $warnings.Add('PROCESS_ENUMERATION_UNAVAILABLE')
}

$hashComparison = 'NOT_REQUESTED'
if ($ExpectedLauncherSha256) {
  if ($null -eq $exeHash) {
    $hashComparison = 'UNKNOWN'
  } elseif ($exeHash -eq $ExpectedLauncherSha256.ToLowerInvariant()) {
    $hashComparison = 'MATCH'
  } else {
    $hashComparison = 'MISMATCH'
    $warnings.Add('LAUNCHER_HASH_DIFFERS_FROM_EXPECTATION')
  }
}

$report = [ordered]@{
  operation = 'dch.desktop.launcher.audit'
  evidenceClass = 'read-only-local-observation'
  observedAtUtc = $observedAt
  root = $root
  workstationExists = $sourceExists
  workstationMarkersPresent = ($markerMissing.Count -eq 0)
  missingMarkers = @($markerMissing)
  sourceHead = $head
  sourceBranch = $branch
  trackedChangedFileCount = $trackedChanged
  untrackedFileCount = $untrackedCount
  launcherPath = $exe
  launcherExists = $exeExists
  launcherSha256 = $exeHash
  launcherBytes = $exeBytes
  launcherLastWriteUtc = $exeLastWriteUtc
  expectedHashComparison = $hashComparison
  runningLauncherProcessCount = $matchingProcessCount
  otherPathLauncherProcessCount = $otherPathProcessCount
  launcherBuildProvenance = 'UNKNOWN_UNTIL_REPRODUCIBLE_BUILD_RECEIPT'
  launcherUpToDate = 'NOT_DETERMINABLE_FROM_THIS_AUDIT'
  wroteFiles = $false
  changedProcessState = $false
  warnings = @($warnings)
}
$report | ConvertTo-Json -Depth 6 -Compress