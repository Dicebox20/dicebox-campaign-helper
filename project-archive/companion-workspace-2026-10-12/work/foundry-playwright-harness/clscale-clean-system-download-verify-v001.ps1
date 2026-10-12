$ErrorActionPreference='Stop'
$root='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001'
$archive=Join-Path $root 'dnd5e-release-5.3.3-official.zip'
$uri='https://github.com/foundryvtt/dnd5e/releases/download/release-5.3.3/dnd5e-release-5.3.3.zip'
$hash='d998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be'
$size=107097110
$system=Join-Path $root 'userdata\Data\systems\dnd5e'
if(Test-Path -LiteralPath $archive){throw 'ARCHIVE_EXISTS_NO_BLIND_RETRY'}
if(Test-Path -LiteralPath $system){throw 'SCRATCH_SYSTEM_EXISTS'}
if(!(Test-Path -LiteralPath $root)){throw 'SANDBOX_MISSING'}
$drive=(Get-Item -LiteralPath $root).PSDrive
if($drive.Free -lt 350MB){throw 'INSUFFICIENT_FREE_SPACE'}
$headers=@{'User-Agent'='DiceBox-sandbox-verified-official-release'}
Invoke-WebRequest -Uri $uri -Headers $headers -MaximumRedirection 6 -UseBasicParsing -OutFile $archive -TimeoutSec 180
$stat=Get-Item -LiteralPath $archive
$actual=(Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
if($stat.Length -ne $size -or $actual -ne $hash){throw ('DOWNLOADED_PACKAGE_INTEGRITY_FAILURE size='+$stat.Length+' digest='+$actual)}
[pscustomobject]@{status='OFFICIAL_ARCHIVE_DIGEST_VERIFIED_NO_EXTRACTION';file=$archive;size=$stat.Length;sha256=$actual;source=$uri}|ConvertTo-Json -Compress|Write-Output