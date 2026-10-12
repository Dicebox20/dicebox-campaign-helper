$ErrorActionPreference='Stop'
$uri='https://github.com/foundryvtt/dnd5e/releases/download/release-5.3.3/system.json'
$root='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001'
$manifest=Join-Path $root 'official-dnd5e-release-5.3.3-manifest.json'
if(Test-Path -LiteralPath $manifest){throw 'MANIFEST_ALREADY_PRESENT_NO_BLIND_REPLAY'}
$headers=@{'User-Agent'='DiceBox-foreman-sandbox-manifest-validation'}
$response=Invoke-WebRequest -Uri $uri -Headers $headers -UseBasicParsing -MaximumRedirection 6 -TimeoutSec 30
if([int]$response.StatusCode -ne 200){throw ('UPSTREAM_HTTP_'+$response.StatusCode)}
$body=if($response.Content -is [byte[]]){[System.Text.Encoding]::UTF8.GetString($response.Content)}else{[string]$response.Content}
$json=$body|ConvertFrom-Json
Write-Output ([pscustomobject]@{id=$json.id;version=$json.version;download=$json.download;manifest=$json.manifest;hasDownload=!!$json.download}|ConvertTo-Json -Compress)
if($json.id -ne 'dnd5e' -or $json.version -ne '5.3.3' -or $json.download -notmatch '^https://'){throw 'UNEXPECTED_UPSTREAM_MANIFEST'}
if($json.download -notmatch 'github.com/foundryvtt/dnd5e/releases/download/release-5.3.3/'){throw 'ZIP_NOT_EXACT_RELEASE'}
[System.IO.File]::WriteAllText($manifest,$body,(New-Object System.Text.UTF8Encoding($false)))
$sha=(Get-FileHash -LiteralPath $manifest -Algorithm SHA256).Hash.ToLowerInvariant()
[pscustomobject]@{manifest=$manifest;sha256=$sha;id=$json.id;version=$json.version;download=$json.download;minimumFoundry=$json.compatibility.minimum;verifiedFoundry=$json.compatibility.verified;status='VALID_RELEASE_MANIFEST_LOCAL_ONLY'}|ConvertTo-Json -Compress|Write-Output