$ErrorActionPreference='Stop'
$repo='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper'
$prod='C:\Users\rujie\AppData\Local\FoundryVTT'
$root=Join-Path $repo 'work\foundry-teleport-sandbox-v001\userdata'
$world='dicebox-f1-teleport-acceptance-v001'
$source=Join-Path $prod 'Data\systems\dnd5e'
if(Test-Path -LiteralPath $root){throw 'STOP: Scratch userData already exists, do not overwrite or replay'}
if(!(Test-Path -LiteralPath (Join-Path $source 'system.json'))){throw 'STOP: Source installed system missing'}
if(!$root.StartsWith((Join-Path $repo 'work\foundry-teleport-sandbox-v001')+'\',[StringComparison]::OrdinalIgnoreCase)){throw 'STOP: Root outside authorized workspace'}
$worldFolder=Join-Path $root ('Data\worlds\'+$world)
$sysFolder=Join-Path $root 'Data\systems'
$confFolder=Join-Path $root 'Config'
$modulesFolder=Join-Path $root 'Data\modules'
New-Item -ItemType Directory -Path $worldFolder,$sysFolder,$confFolder,$modulesFolder -Force | Out-Null
$manifest=[ordered]@{
 title='DiceBox F1 Teleport Acceptance - Private Disposable';id=$world;system='dnd5e';
 description='Disposable isolated test. Contains no real campaign scenes, users, or tokens.';
 coreVersion='14.367';systemVersion='5.3.3';
 compatibility=[ordered]@{minimum='14';verified='14.367'};
 packs=@();modules=@();joinTheme='default'
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $worldFolder 'world.json') -Encoding UTF8
$options=[ordered]@{port=30010;upnp=$false;dataPath=$root;world=$world}
$options | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $confFolder 'options.json') -Encoding UTF8
# Physically copy the dnd5e system so the test backend cannot mutate shared package files.
Copy-Item -LiteralPath $source -Destination $sysFolder -Recurse -ErrorAction Stop
$copy=Join-Path $root 'Data\systems\dnd5e\system.json'
if(!(Test-Path -LiteralPath $copy)){throw 'STOP: Private dnd5e physical copy missing'}
$m=Get-Content -LiteralPath $copy -Raw|ConvertFrom-Json
if($m.id -ne 'dnd5e' -or $m.version -ne '5.3.3'){throw 'STOP: Version mismatch'}
$files=Get-ChildItem -LiteralPath (Join-Path $root 'Data\systems\dnd5e') -Recurse -File
Write-Output ('STAGED_DISPOSABLE_DATA_ROOT '+$root)
Write-Output ('STAGED_WORLD '+$world+' system '+$m.version)
Write-Output ('PRIVATE_SYSTEM_COPY '+@($files).Count+' files '+[math]::Round((($files|Measure-Object Length -Sum).Sum)/1MB,1)+' MiB')
Write-Output 'NO_SERVER_STARTED NO_FIREWALL_MODIFICATION NO_LIVE_CAMPAIGN_CHANGE NO_CREDENTIAL_COPIES'