[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SourceRoot,

    [Parameter(Mandatory = $true)]
    [string]$RepoRoot,

    [switch]$IncludeActorExports
)

$ErrorActionPreference = "Stop"
$manifestPath = Join-Path $RepoRoot "docs/startake/asset-manifest.json"
$statusPath = Join-Path $RepoRoot "docs/startake/MIGRATION_STATUS.md"
$expectedBranch = "startake/migration-2026-10-22"

if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    throw "Manifest not found: $manifestPath"
}
if (-not (Test-Path -LiteralPath $statusPath -PathType Leaf)) {
    throw "Migration status not found: $statusPath"
}

$branch = (& git -C $RepoRoot branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
    throw "Run from branch '$expectedBranch'. Current branch: '$branch'. No files copied."
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$targets = @($manifest.files | Where-Object {
    $_.mime_type -in @(
        "image/png",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip"
    ) -or ($IncludeActorExports -and $_.name -like "fvtt-Actor-*.json")
})

if (-not $targets.Count) { throw "No eligible source entries found in manifest." }

# Preflight every file before copying anything.
$problems = [System.Collections.Generic.List[string]]::new()
$resolved = [System.Collections.Generic.List[object]]::new()
foreach ($entry in $targets) {
    $leaf = [System.IO.Path]::GetFileName([string]$entry.source_path)
    $source = Join-Path $SourceRoot $leaf
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        $problems.Add("Missing: $source")
        continue
    }
    $actual = (Get-Item -LiteralPath $source).Length
    if ($actual -ne [long]$entry.size_bytes) {
        $problems.Add("Size mismatch: $leaf expected $($entry.size_bytes), got $actual")
        continue
    }
    $resolved.Add([pscustomobject]@{ Entry = $entry; Source = $source; Leaf = $leaf })
}
if ($problems.Count) {
    $problems | ForEach-Object { Write-Error $_ }
    throw "Preflight failed. No files were copied."
}

foreach ($item in $resolved) {
    $destination = Join-Path $RepoRoot ([string]$item.Entry.repository_path)
    $directory = Split-Path -Parent $destination
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    Copy-Item -LiteralPath $item.Source -Destination $destination -Force
    $actual = (Get-Item -LiteralPath $destination).Length
    if ($actual -ne [long]$item.Entry.size_bytes) {
        throw "Post-copy size mismatch at $destination. Preserve this branch and investigate."
    }
    if ($item.Entry.name -like "fvtt-Actor-*.json") {
        $item.Entry.handling = "Copied as original bytes by complete-startake-binary-migration.ps1; source size verified."
    } else {
        $item.Entry.handling = "Copied as original binary bytes by complete-startake-binary-migration.ps1; source size verified."
    }
}

$manifest.generated_at = [DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$manifest | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $manifestPath -Encoding utf8

$copiedBinaryCount = @($manifest.files | Where-Object {
    $_.mime_type -in @("image/png","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/zip") -and
    $_.handling -like "Copied as original binary bytes*"
}).Count
$actorCount = @($manifest.files | Where-Object {
    $_.name -like "fvtt-Actor-*.json" -and $_.handling -like "Copied as original bytes*"
}).Count
$binaryTotal = @($manifest.files | Where-Object {
    $_.mime_type -in @("image/png","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/zip")
}).Count
$actorTotal = @($manifest.files | Where-Object { $_.name -like "fvtt-Actor-*.json" }).Count

$status = @"
# STARTAKE migration status

## Scope and verification

Source inventory: $($manifest.file_count) files, $($manifest.total_source_bytes) bytes. Repository branch: $expectedBranch. This script only copies files after a complete preflight and verifies each copied file's byte length against the manifest. Byte-length verification is not a cryptographic checksum.

- Binary assets copied and size-verified: $copiedBinaryCount / $binaryTotal (PNG, XLSX, ZIP).
- Foundry Actor JSON exports copied and size-verified: $actorCount / $actorTotal.
- Four large/tool-filtered text records remain represented by pointer files and ordered parts; concatenate parts in numeric order to reconstruct each source text.
- The source manifest remains the inventory of source paths, MIME types, sizes and Library IDs.
- This script does not merge the branch or change main.

## Final checks before opening or updating the pull request

1. Inspect git status and the staged diff.
2. Confirm the manifest lists every source file and that all expected binaries exist at their mapped paths.
3. Re-open representative PNG, XLSX and ZIP files from the repository and verify they parse.
4. Review whether the six Foundry Actor JSON exports should be included; pass -IncludeActorExports only when intentionally archiving them.
5. Commit and push the changes to $expectedBranch; keep PR #21 draft until the archive review is complete.
"@
Set-Content -LiteralPath $statusPath -Value $status -Encoding utf8

$paths = @($resolved | ForEach-Object { [string]$_.Entry.repository_path })
$absolutePaths = @($paths | ForEach-Object { Join-Path $RepoRoot $_ })
& git -C $RepoRoot add -- $manifestPath $statusPath @($absolutePaths)
if ($LASTEXITCODE -ne 0) { throw "git add failed. Files remain on disk; inspect git status." }

Write-Output "Copied and size-verified $($resolved.Count) files."
Write-Output "Binary assets: $copiedBinaryCount/$binaryTotal. Actor exports: $actorCount/$actorTotal."
Write-Output "Changes staged only; no commit, push, or merge was performed."
