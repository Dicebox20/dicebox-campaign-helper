$ErrorActionPreference='Stop'
$base='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001'
$src=Join-Path $base 'userdata\Data\systems\dnd5e'
$dst=Join-Path $base 'quarantine\incomplete-live-system-copy-20261009-v001'
if(!(Test-Path -LiteralPath $src) -or (Test-Path -LiteralPath $dst)){throw 'STOP_OLD_OR_NEW_UNEXPECTED'}
$manifest=Join-Path $src 'system.json'
if(!(Test-Path -LiteralPath $manifest)){throw 'STOP_NO_MANIFEST'}
$m=Get-Content -LiteralPath $manifest -Raw|ConvertFrom-Json
$files=Get-ChildItem -LiteralPath $src -Recurse -File
if($m.id -ne 'dnd5e' -or $m.version -ne '5.3.3' -or @($files).Count -ne 269){throw 'STOP_NOT_THE_EXACT_PARTIAL_COPY'}
New-Item -ItemType Directory -Path (Split-Path -Parent $dst) -Force | Out-Null
Move-Item -LiteralPath $src -Destination $dst -ErrorAction Stop
if((Test-Path -LiteralPath $src) -or !(Test-Path -LiteralPath $dst)){throw 'STOP_QUARANTINE_OUTCOME_UNKNOWN'}
Write-Output ('PARTIAL_COPY_QUARANTINED '+$dst+' FILES 269')
Write-Output 'NO_PRODUCTION_FILES_CHANGED NO_PARTIAL_SYSTEM_INSTALLED'