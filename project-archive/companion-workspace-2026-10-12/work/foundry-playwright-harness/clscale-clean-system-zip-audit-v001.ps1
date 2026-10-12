$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001\dnd5e-release-5.3.3-official.zip'
$expected='d998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be'
if((Get-FileHash $archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected){throw 'PACKAGE_HASH_MISMATCH'}
$zip=[System.IO.Compression.ZipFile]::OpenRead($archive)
try{
 $names=New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
 $folders=New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
 [long]$total=0
 $n=0
 $bad=0
 $roots=@{}
 foreach($entry in $zip.Entries){
  $name=$entry.FullName.Replace('\','/')
  if(!$name -or $name.StartsWith('/') -or $name -match '(^|/)\.\.(/|$)' -or $name -match ':' -or $name.StartsWith('//') -or $name -match '[\x00-\x1F]' ){throw ('PATH_ESCAPE '+$name)}
  if(!$names.Add($name)){throw ('DUPLICATE_ARCHIVE_PATH '+$name)}
  $mode=[int](($entry.ExternalAttributes -shr 16) -band 61440)
  if($mode -eq 40960){throw ('SYMLINK_ENTRY '+$name)}
  if($entry.Length -gt 100MB){throw ('SINGLE_ENTRY_TOO_LARGE '+$name)}
  if(!$name.EndsWith('/')){$n++;$total+=$entry.Length}
  $first=$name.Split('/')[0]
  if(!$roots.ContainsKey($first)){$roots[$first]=0}
  $roots[$first]++
 }
 if($n -lt 1000 -or $total -lt 110MB -or $total -gt 350MB){throw 'ARCHIVE_CONTENT_COUNT_OR_UNPACKED_SIZE_SUSPICIOUS'}
 [pscustomobject]@{status='CLEAN_OFFICIAL_ZIP_CONTENT_AUDITED';totalEntries=$names.Count;fileEntries=$n;uncompressedMiB=[math]::Round($total/1MB,2);topLevelEntryCount=$roots.Count;topLevelSample=@($roots.Keys|Sort-Object|Select-Object -First 18)}|ConvertTo-Json -Compress|Write-Output
}finally{$zip.Dispose()}