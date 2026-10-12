[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$WorkUnitId,
  [Parameter(Mandatory = $true)][ValidateSet('PASS','BLOCKED','PARTIAL','FAILED','OUTCOME_UNKNOWN')][string]$Status,
  [Parameter(Mandatory = $true)][string]$NextAction,
  [ValidateSet('CONTINUE','STOP')][string]$Continuation = 'CONTINUE',
  [ValidateSet('research','local','staged','fixture','Ballad','player-accepted')][string]$EvidenceLayer = 'local',
  [string]$Summary = '',
  [string]$Blocker = '',
  [string[]]$ChangedPaths = @(),
  [string[]]$Validation = @(),
  [string]$RuntimeTarget = '',
  [string]$ReceiptRef = ''
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $repoRoot 'outputs'
$historyRoot = Join-Path $outputRoot 'foreman-checkpoints'
$latestPath = Join-Path $outputRoot 'LATEST-FOREMAN-CHECKPOINT.json'
New-Item -ItemType Directory -Path $historyRoot -Force | Out-Null

function Get-FileDigest([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  $stream = [System.IO.File]::OpenRead($Path)
  try {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    return ([System.BitConverter]::ToString($sha.ComputeHash($stream))).Replace('-','')
  } finally {
    $stream.Dispose()
  }
}

function Get-StringDigest([string]$Text) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    return ([System.BitConverter]::ToString($sha.ComputeHash($bytes))).Replace('-','')
  } finally {
    $sha.Dispose()
  }
}

function Invoke-GitSafe([string[]]$Arguments) {
  try {
    $result = @(& git -C $repoRoot @Arguments 2>$null)
    if ($LASTEXITCODE -ne 0) { return @() }
    return $result
  } catch {
    return @()
  }
}

$headLines = @(Invoke-GitSafe @('rev-parse','HEAD'))
$head = if ($headLines.Count -gt 0) { [string]$headLines[0] } else { $null }
$dirtyAll = @(Invoke-GitSafe @('status','--short'))
$dirtyText = [string]::Join([Environment]::NewLine, $dirtyAll)
$dirtySampleLimit = 120
$dirtySample = @($dirtyAll | Select-Object -First $dirtySampleLimit)

$cardPath = Join-Path $repoRoot 'docs\ACTIVE-PROGRAM-SLICE.json'
$roadmapPath = Join-Path $repoRoot 'docs\DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md'
$seedPath = Join-Path $repoRoot 'database\seed.sql'
$cardSummary = $null
if (Test-Path -LiteralPath $cardPath) {
  try {
    $card = Get-Content -Raw -LiteralPath $cardPath | ConvertFrom-Json
    $workspaceNext = $null
    if ($card.acceptedGPTWorkspaceRoadmapRevision20261001) {
      $workspaceNext = $card.acceptedGPTWorkspaceRoadmapRevision20261001.nextAction
    }
    $cardSummary = [ordered]@{
      updatedAt = $card.updatedAt
      goalId = $card.goalId
      scopeBoundary = $card.scopeBoundary
      workspaceNextAction = $workspaceNext
    }
  } catch {
    $cardSummary = [ordered]@{ parseError = $_.Exception.Message }
  }
}

$timestamp = [DateTime]::UtcNow
$safeId = ($WorkUnitId -replace '[^A-Za-z0-9._-]','-').Trim('-')
if ([string]::IsNullOrWhiteSpace($safeId)) { $safeId = 'work-unit' }
$fileStamp = $timestamp.ToString('yyyyMMddTHHmmssfffZ')
$historyPath = Join-Path $historyRoot ($fileStamp + '-' + $safeId + '.json')

$checkpoint = [ordered]@{
  schemaVersion = '1.0.0'
  checkpointType = 'campaign-helper-foreman'
  timestampUtc = $timestamp.ToString('o')
  workUnitId = $WorkUnitId
  status = $Status
  continuation = $Continuation
  evidenceLayer = $EvidenceLayer
  summary = $Summary
  blocker = $Blocker
  nextAction = $NextAction
  changedPaths = @($ChangedPaths)
  validation = @($Validation)
  runtimeTarget = $RuntimeTarget
  receiptRef = $ReceiptRef
  repository = [ordered]@{
    root = $repoRoot
    head = $head
    dirtyCount = $dirtyAll.Count
    dirtyFingerprintSha256 = Get-StringDigest $dirtyText
    dirtySample = $dirtySample
    dirtySampleTruncated = ($dirtyAll.Count -gt $dirtySampleLimit)
  }
  controlPlane = [ordered]@{
    activeCard = $cardSummary
    activeCardSha256 = Get-FileDigest $cardPath
    roadmapSha256 = Get-FileDigest $roadmapPath
    seedSha256 = Get-FileDigest $seedPath
  }
  authorityBoundary = 'Continuity evidence only. This checkpoint does not accept project changes, promote a stage, confer Foundry authority, or satisfy Ready-to-Play.'
}

$json = $checkpoint | ConvertTo-Json -Depth 12
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($historyPath, $json + [Environment]::NewLine, $utf8)
$tempLatest = $latestPath + '.tmp'
[System.IO.File]::WriteAllText($tempLatest, $json + [Environment]::NewLine, $utf8)
Move-Item -LiteralPath $tempLatest -Destination $latestPath -Force
Write-Output $json