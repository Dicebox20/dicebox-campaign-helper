$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$base='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001'
$archive=Join-Path $base 'dnd5e-release-5.3.3-official.zip'
$staging=Join-Path $base 'userdata\Data\systems\dnd5e-validated-extract-v001'
$installed=Join-Path $base 'userdata\Data\systems\dnd5e'
if((Test-Path $installed) -or !(Test-Path $staging)){throw 'PROMOTION_PRECONDITION_DRIFT'}
if((Get-FileHash $archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne 'd998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be'){throw 'OFFICIAL_ARCHIVE_DRIFT'}
$zip=[IO.Compression.ZipFile]::OpenRead($archive)
try{
 $entries=@($zip.Entries|Where-Object {!$_.FullName.EndsWith('/')})
 $files=@(Get-ChildItem -LiteralPath $staging -Recurse -File)
 if($entries.Count -ne 1410 -or $files.Count -ne $entries.Count){throw 'FILE_COUNT_DRIFT'}
 $locks=@($entries|Where-Object {$_.Name -eq 'LOCK'})
 if($locks.Count -ne 22 -or @($locks|Where-Object{$_.Length -ne 0}).Count -ne 0){throw 'RELEASE_LOCK_PROFILE_DRIFT'}
 [long]$bytes=0
 foreach($e in $entries){
  $rel=$e.FullName.Replace('/','\')
  $f=Join-Path $staging $rel
  if(!(Test-Path -LiteralPath $f)){throw ('EXTRACT_ENTRY_MISSING '+$rel)}
  $info=Get-Item -LiteralPath $f
  if($info.Length -ne $e.Length){throw ('EXTRACT_ENTRY_LENGTH_DRIFT '+$rel)}
  $bytes+=$info.Length
 }
 if($bytes -lt 126MB -or $bytes -gt 132MB){throw 'EXTRACTED_BYTES_DRIFT'}
 $manifest=Join-Path $staging 'system.json'
 $m=Get-Content -LiteralPath $manifest -Raw|ConvertFrom-Json
 if($m.id -ne 'dnd5e' -or $m.version -ne '5.3.3' -or $m.download -ne 'https://github.com/foundryvtt/dnd5e/releases/download/release-5.3.3/dnd5e-release-5.3.3.zip'){throw 'SYSTEM_MANIFEST_DRIFT'}
 $officialManifest=Get-Content -LiteralPath (Join-Path $base 'official-dnd5e-release-5.3.3-manifest.json') -Raw|ConvertFrom-Json
 if($officialManifest.version -ne $m.version -or $officialManifest.id -ne $m.id){throw 'OFFICIAL_MANIFEST_CONFLICT'}
 Move-Item -LiteralPath $staging -Destination $installed -ErrorAction Stop
 if(!(Test-Path (Join-Path $installed 'system.json')) -or (Test-Path -LiteralPath $staging)){throw 'PROMOTION_OUTCOME_UNKNOWN'}
 [pscustomobject]@{status='OFFICIAL_SCRATCH_SYSTEM_INSTALLED';root=$installed;fileCount=$entries.Count;sizeMiB=[math]::Round($bytes/1MB,2);zeroByteLockFiles=22;releaseSha='d998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be';manifestSha=(Get-FileHash -LiteralPath (Join-Path $installed 'system.json') -Algorithm SHA256).Hash.ToLowerInvariant();productionTouched=$false;serverStarted=$false}|ConvertTo-Json -Compress|Write-Output
}finally{$zip.Dispose()}