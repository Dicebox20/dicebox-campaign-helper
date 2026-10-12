$ErrorActionPreference = 'SilentlyContinue'
$root = 'C:\Users\rujie\AppData\Local\FoundryVTT'
$worldDir = Join-Path $root 'Data\worlds'
Write-Output '== INSTALLED WORLD MANIFESTS (sanitized) =='
foreach($world in (Get-ChildItem -LiteralPath $worldDir -Directory)) {
 $p=Join-Path $world.FullName 'world.json'
 if(Test-Path -LiteralPath $p){
  try {
   $j=Get-Content -LiteralPath $p -Raw | ConvertFrom-Json
   [PSCustomObject]@{folder=$world.Name; id=$j.id;title=$j.title;system=$j.system;coreVersion=$j.coreVersion;compatibility=$j.compatibility;modified=$world.LastWriteTime.ToString('s');packages=(@($j.packages).Count);lastPlayed=$j.lastPlayed} | ConvertTo-Json -Compress -Depth 3 | Write-Output
  } catch { Write-Output ('UNREADABLE_MANIFEST '+$world.Name) }
 } else { Write-Output ('NO_MANIFEST '+$world.Name) }
}
Write-Output '== DND5E SYSTEM MANIFEST (sanitized) =='
$p=Join-Path $root 'Data\systems\dnd5e\system.json'
if(Test-Path -LiteralPath $p){try{$j=Get-Content -LiteralPath $p -Raw|ConvertFrom-Json;[PSCustomObject]@{id=$j.id;version=$j.version;compatibility=$j.compatibility;manifest=$j.manifest} | ConvertTo-Json -Compress -Depth 4 | Write-Output}catch {Write-Output 'SYSTEM_MANIFEST_ERROR'}}
Write-Output '== FOUNDRY APP SERVER ENTRYPOINT CANDIDATES =='
@('C:\Program Files\Foundry Virtual Tabletop\resources\app\main.js','C:\Program Files\Foundry Virtual Tabletop\resources\app\main.mjs','C:\Program Files\Foundry Virtual Tabletop\resources\app\dist','C:\Program Files\Foundry Virtual Tabletop\resources\app\package.json') | ForEach-Object {if(Test-Path -LiteralPath $_){ $e=Get-Item $_; Write-Output ('FOUND '+$e.FullName+' '+$e.PSIsContainer)}}
Write-Output '== FOUNDry system copy size (no file content) =='
$p=Join-Path $root 'Data\systems\dnd5e'
if(Test-Path -LiteralPath $p){ $list=Get-ChildItem -LiteralPath $p -Recurse -File;[PSCustomObject]@{fileCount=@($list).Count;sizeMiB=[math]::Round((($list|Measure-Object Length -Sum).Sum)/1MB,1)} | ConvertTo-Json -Compress | Write-Output }