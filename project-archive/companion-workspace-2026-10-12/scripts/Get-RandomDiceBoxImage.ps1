param(
  [string]$Query = "",
  [int]$Count = 1,
  [string]$SourceId = "game-icons-net-svg",
  [switch]$AllMatches,
  [switch]$AsJson
)
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$configPath = Join-Path $scriptDir "random-image-sources.json"
if (-not (Test-Path -LiteralPath $configPath)) { throw "Dicebox image-source configuration is missing: $configPath" }
$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
$source = @($config.sources | Where-Object { $_.id -eq $SourceId -and $_.enabled -eq $true }) | Select-Object -First 1
if (-not $source) { throw "Enabled image source not found: $SourceId" }
if (-not (Test-Path -LiteralPath $source.index)) { throw "Image index not found: $($source.index)" }
$rows = @(Import-Csv -LiteralPath $source.index)
$terms = @($Query.ToLowerInvariant() -split "[^a-z0-9]+" | Where-Object { $_.Length -ge 2 })
if ($terms.Count -gt 0) {
  $rows = @($rows | Where-Object {
    $hay = (($_.Name + " " + $_.SearchText + " " + $_.Author + " " + $_.RelativePath)).ToLowerInvariant()
    $ok = $true
    foreach ($term in $terms) { if ($hay -notlike ("*" + $term + "*")) { $ok = $false; break } }
    $ok
  })
}
if ($rows.Count -eq 0) {
  if ($AsJson) { "[]" } else { Write-Warning "No Dicebox images matched query: $Query" }
  exit 0
}
$normalized = @($rows | ForEach-Object {
  [pscustomobject]@{
    Name = $_.Name
    Author = $_.Author
    FullPath = $_.FullPath
    RelativePath = $_.RelativePath
    SourceId = $SourceId
    Extension = [IO.Path]::GetExtension($_.FullPath)
  }
})
if ($AllMatches) { $result = $normalized } else {
  $take = [Math]::Max(1, [Math]::Min($Count, $normalized.Count))
  $result = @($normalized | Get-Random -Count $take)
}
if ($AsJson) { $result | ConvertTo-Json -Depth 4 } else { $result }
