$ErrorActionPreference='Stop'
$base='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001'
$zip=Join-Path $base 'dnd5e-release-5.3.3-official.zip'
$targetRoot=Join-Path $base 'userdata\Data\systems'
$target=Join-Path $targetRoot 'dnd5e'
$tmp=Join-Path $targetRoot 'dnd5e-validated-extract-v001'
$expectedZipSha='d998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be'
if((Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expectedZipSha){throw 'OFFICIAL_ZIP_SHA_DRIFT'}
if((Test-Path -LiteralPath $target) -or (Test-Path -LiteralPath $tmp)){throw 'SYSTEM_INSTALL_DESTINATION_EXISTS_STOP'}
if(!(Test-Path -LiteralPath $targetRoot)){throw 'MISSING_SCRATCH_SYSTEM_ROOT'}
$world=Join-Path $base 'userdata\Data\worlds\dicebox-f1-teleport-acceptance-v001\world.json'
if(!(Test-Path -LiteralPath $world)){throw 'MISSING_SANDBOX_WORLD'}
Expand-Archive -LiteralPath $zip -DestinationPath $tmp -ErrorAction Stop
$files=Get-ChildItem -LiteralPath $tmp -Recurse -File
$bytes=($files|Measure-Object Length -Sum).Sum
if(@($files).Count -ne 1410 -or $bytes -lt 126MB -or $bytes -gt 132MB){throw ('ZIP_CONTENT_EXTRACT_DRIFT '+@($files).Count+' '+$bytes)}
if(@($files|Where-Object {$_.Name -eq 'LOCK'}).Count){throw 'EXTRACTED_LIVE_LOCK_FILES_UNEXPECTED'}
$manifest=Join-Path $tmp 'system.json'
if(!(Test-Path $manifest)){throw 'EXTRACT_SYSTEM_JSON_MISSING'}
$j=Get-Content -LiteralPath $manifest -Raw|ConvertFrom-Json
if($j.id -ne 'dnd5e' -or $j.version -ne '5.3.3' -or $j.download -ne 'https://github.com/foundryvtt/dnd5e/releases/download/release-5.3.3/dnd5e-release-5.3.3.zip'){throw 'OFFICIAL_SYSTEM_MANIFEST_NOT_EXPECTED'}
if(!(Test-Path (Join-Path $tmp 'dnd5e.mjs'))){throw 'SYSTEM_ENTRYPOINT_MISSING'}
Move-Item -LiteralPath $tmp -Destination $target -ErrorAction Stop
$files=Get-ChildItem -LiteralPath $target -Recurse -File
if(@($files).Count -ne 1410){throw 'INSTALLED_SYSTEM_FILECOUNT_NOT_1410'}
[pscustomobject]@{status='SCRATCH_DND5E_5_3_3_PHYSICAL_INSTALL_VERIFIED';target=$target;files=@($files).Count;sizeMiB=[math]::Round($bytes/1MB,2);officialZipSha256=$expectedZipSha;systemManifestSha256=(Get-FileHash -LiteralPath (Join-Path $target 'system.json') -Algorithm SHA256).Hash.ToLowerInvariant();serverStarted=$false;productionTouched=$false}|ConvertTo-Json -Compress|Write-Output