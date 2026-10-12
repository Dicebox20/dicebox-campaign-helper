[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

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

function Get-FileState([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    return [ordered]@{ path = $Path; exists = $false }
  }
  $item = Get-Item -LiteralPath $Path
  return [ordered]@{
    path = $Path
    exists = $true
    length = $item.Length
    lastWriteTime = $item.LastWriteTime.ToString('o')
  }
}

$headLines = @(Invoke-GitSafe @('rev-parse','HEAD'))
$head = if ($headLines.Count -gt 0) { [string]$headLines[0] } else { $null }
$dirtyAll = @(Invoke-GitSafe @('status','--short'))
$dirtyText = [string]::Join([Environment]::NewLine, $dirtyAll)
$dirtySampleLimit = 120
$dirtySample = @($dirtyAll | Select-Object -First $dirtySampleLimit)

$foundationAgents = 'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\AGENTS.md'
$localAgents = Join-Path $repoRoot 'AGENTS.md'
$workflow = Join-Path $repoRoot 'docs\FOREMAN-WORKFLOW-CURRENT.md'
$roadmap = Join-Path $repoRoot 'docs\DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md'
$activeCard = Join-Path $repoRoot 'docs\ACTIVE-PROGRAM-SLICE.json'
$devWorkflow = Join-Path $repoRoot 'docs\CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md'
$seed = Join-Path $repoRoot 'database\seed.sql'
$database = Join-Path $repoRoot 'database\dicebox_campaign_helper_knowledge.sqlite'
$latest = Join-Path $repoRoot 'outputs\LATEST-FOREMAN-CHECKPOINT.json'

$cardSummary = $null
if (Test-Path -LiteralPath $activeCard) {
  try {
    $card = Get-Content -Raw -LiteralPath $activeCard | ConvertFrom-Json
    $workflowRevision = $null
    if ($card.acceptedForemanWorkflowContinuityRevision20261001) {
      $workflowRevision = $card.acceptedForemanWorkflowContinuityRevision20261001
    }
    $workspaceRevision = $null
    if ($card.acceptedGPTWorkspaceRoadmapRevision20261001) {
      $workspaceRevision = $card.acceptedGPTWorkspaceRoadmapRevision20261001
    }
    $cardSummary = [ordered]@{
      updatedAt = $card.updatedAt
      goalId = $card.goalId
      scopeBoundary = $card.scopeBoundary
      foremanWorkflow = $workflowRevision
      workspaceRoadmap = $workspaceRevision
    }
  } catch {
    $cardSummary = [ordered]@{ parseError = $_.Exception.Message }
  }
}

$latestCheckpoint = $null
if (Test-Path -LiteralPath $latest) {
  try {
    $latestCheckpoint = Get-Content -Raw -LiteralPath $latest | ConvertFrom-Json
  } catch {
    $latestCheckpoint = [ordered]@{ parseError = $_.Exception.Message }
  }
}

$state = [ordered]@{
  schemaVersion = '1.0.0'
  generatedAtUtc = [DateTime]::UtcNow.ToString('o')
  repository = [ordered]@{
    root = $repoRoot
    head = $head
    dirtyCount = $dirtyAll.Count
    dirtyFingerprintSha256 = Get-StringDigest $dirtyText
    dirtySample = $dirtySample
    dirtySampleTruncated = ($dirtyAll.Count -gt $dirtySampleLimit)
  }
  authoritativeFiles = @(
    Get-FileState $foundationAgents
    Get-FileState $localAgents
    Get-FileState $workflow
    Get-FileState $roadmap
    Get-FileState $activeCard
    Get-FileState $devWorkflow
    Get-FileState $seed
    Get-FileState $database
    Get-FileState $latest
  )
  activeCard = $cardSummary
  latestCheckpoint = $latestCheckpoint
  recoveryRule = 'Read disk and KB before selecting a new canonical write or live action. Reconcile OUTCOME_UNKNOWN or manual blockers before retry.'
}
$state | ConvertTo-Json -Depth 14