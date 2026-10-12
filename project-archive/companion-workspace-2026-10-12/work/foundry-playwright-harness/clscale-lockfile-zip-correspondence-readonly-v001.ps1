$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001'
$archive=Join-Path $root 'dnd5e-release-5.3.3-official.zip'
$tmp=Join-Path $root 'userdata\Data\systems\dnd5e-validated-extract-v001'
if((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne 'd998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be'){throw 'OFFICIAL_ZIP_DRIFT'}
$zip=[System.IO.Compression.ZipFile]::OpenRead($archive)
try{
 $entryLocks=@($zip.Entries|Where-Object{$_.Name -eq 'LOCK'}|Select-Object FullName,Length)
 $fileLocks=@(Get-ChildItem -LiteralPath $tmp -Recurse -File|Where-Object{$_.Name -eq 'LOCK'})
 $notInZip=0
 foreach($f in $fileLocks){$rel=$f.FullName.Substring($tmp.Length+1).Replace('\','/');$e=$zip.GetEntry($rel);if(!$e -or $e.Length -ne $f.Length){$notInZip++}}
 $list=@($entryLocks|Select-Object -First 8)
 [pscustomobject]@{status='READONLY_ARCHIVE_AND_EXTRACTED_LOCK_CHECK';officialArchiveLockCount=$entryLocks.Count;extractedLockCount=$fileLocks.Count;nonzeroArchiveLocks=@($entryLocks|Where-Object Length -gt 0).Count;nonzeroExtractedLocks=@($fileLocks|Where-Object Length -gt 0).Count;notInZipOrWrongSize=$notInZip;sample=$list}|ConvertTo-Json -Compress -Depth 4|Write-Output
}finally{$zip.Dispose()}