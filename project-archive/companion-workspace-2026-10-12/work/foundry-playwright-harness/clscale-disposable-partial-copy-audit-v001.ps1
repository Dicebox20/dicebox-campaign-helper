$ErrorActionPreference='SilentlyContinue'
$prod='C:\Users\rujie\AppData\Local\FoundryVTT\Data\systems\dnd5e'
$base='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001\userdata'
$dst=Join-Path $base 'Data\systems\dnd5e'
Write-Output '== NONMUTATING COPY AUDIT =='
foreach($p in @($prod,$dst)){
 if(Test-Path -LiteralPath $p){
  $files=Get-ChildItem -LiteralPath $p -File -Recurse
  $sz=($files|Measure-Object Length -Sum).Sum
  $locks=@($files | Where-Object {$_.Name -eq 'LOCK'}).Count
  Write-Output ('PATH '+$p+' FILES '+@($files).Count+' MIB '+[math]::Round($sz/1MB,2)+' LOCKFILES '+$locks)
  if(Test-Path -LiteralPath (Join-Path $p 'system.json')){$m=Get-Content -LiteralPath (Join-Path $p 'system.json') -Raw|ConvertFrom-Json;Write-Output ('MANIFEST '+$m.id+' version '+$m.version)}
 }
 else{Write-Output ('ABSENT '+$p)}
}
Write-Output '== TEST WORLD STATIC FILES =='
@('Data\worlds\dicebox-f1-teleport-acceptance-v001\world.json','Config\options.json','Config\admin.txt')|ForEach-Object{$p=Join-Path $base $_;Write-Output ('FILE '+$_+' EXISTS '+(Test-Path -LiteralPath $p))}
Write-Output '== LIVE FOUNDRY PID =='
Get-NetTCPConnection -State Listen -LocalPort 30000 | Select-Object LocalPort,OwningProcess | ConvertTo-Json -Compress | Write-Output
Write-Output '== TEST PORT =='
$test=Get-NetTCPConnection -State Listen -LocalPort 30010; Write-Output ('LISTENERS '+@($test).Count)
