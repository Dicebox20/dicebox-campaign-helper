$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
$zipPath='C:\Users\rujie\Downloads\M01_Forgotten_Road_BUILD_v001.zip'
$zipExpected='0ae2c48af60c374a03c4d831d862abdd875b3af84d0a9cf1e4c6b764dc1690d4'
$artExpected='dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a'
$root=Join-Path $env:LOCALAPPDATA 'FoundryVTT\Data\worlds\the-forgotten-realms\assets\dicebox-expedition'
$target=Join-Path $root 'M01_Forgotten_Road_final.png'
if((Get-FileHash $zipPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $zipExpected){ throw 'ZIP_HASH_MISMATCH' }
New-Item -ItemType Directory -Force -Path $root | Out-Null
if(Test-Path $target) {
  $hash=(Get-FileHash $target -Algorithm SHA256).Hash.ToLowerInvariant()
  if($hash -ne $artExpected){throw "REFUSING_OVERWRITE $target $hash"}
  Write-Output ('ALREADY_STAGED SHA256 '+$hash)
} else {
 $temp=$target+'.stage.tmp'
 if(Test-Path $temp){throw 'TEMP_ALREADY_EXISTS'}
 $z=[System.IO.Compression.ZipFile]::OpenRead($zipPath)
 try {
   $entry=$z.GetEntry('M01_Forgotten_Road_final.png')
   if(!$entry){ throw 'ZIP_ENTRY_MISSING'}
   $input=$entry.Open()
   try{$output=[System.IO.File]::Create($temp);try{$input.CopyTo($output)}finally{$output.Dispose()}}finally{$input.Dispose()}
 } finally{$z.Dispose()}
 $hash=(Get-FileHash $temp -Algorithm SHA256).Hash.ToLowerInvariant()
 if($hash -ne $artExpected){Remove-Item $temp -Force;throw "ART_HASH_MISMATCH $hash"}
 Move-Item -Path $temp -Destination $target
 Write-Output ('STAGED SHA256 '+$hash)
}
Write-Output ('ASSET_PATH '+$target)
Write-Output ('FOUNDRY_SRC worlds/the-forgotten-realms/assets/dicebox-expedition/M01_Forgotten_Road_final.png')
