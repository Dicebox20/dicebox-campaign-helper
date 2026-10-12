$ErrorActionPreference='Stop'
$uri='https://api.github.com/repos/foundryvtt/dnd5e/releases/tags/release-5.3.3'
$rel=Invoke-RestMethod -Uri $uri -TimeoutSec 30 -Headers @{'User-Agent'='DiceBox-sandbox-release-verify';'Accept'='application/vnd.github+json'}
if($rel.tag_name -ne 'release-5.3.3' -or $rel.draft -or $rel.prerelease){throw 'RELEASE_METADATA_NOT_OFFICIAL'}
$asset=$rel.assets|Where-Object {$_.name -eq 'dnd5e-release-5.3.3.zip'}
if(@($asset).Count -ne 1 -or $asset.size -lt 20000000 -or $asset.browser_download_url -ne 'https://github.com/foundryvtt/dnd5e/releases/download/release-5.3.3/dnd5e-release-5.3.3.zip'){throw 'ZIP_ASSET_NOT_EXACT'}
[pscustomobject]@{tag=$rel.tag_name;asset=$asset.name;assetId=$asset.id;sizeBytes=$asset.size;digest=$asset.digest;assetUrl=$asset.browser_download_url;status='OFFICIAL_GITHUB_RELEASE_ASSET_METADATA'}|ConvertTo-Json -Compress|Write-Output