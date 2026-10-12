# AUDIT-AND-BACKUP ONLY. Does not enable profiles, alter rules, or start services.
$ErrorActionPreference='Stop'
$repo='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper'
$receipt=Join-Path $repo 'outputs\foreman-checkpoints\clscale-firewall-elevated-audit-v001.json'
$backup=Join-Path $repo 'outputs\foreman-checkpoints\clscale-firewall-policy-before-enable-v001.wfw'
if(!( [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent() ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)){throw 'LOCAL_UAC_ADMIN_APPROVAL_REQUIRED'}
if(Test-Path $receipt){throw 'AUDIT_RECEIPT_EXISTS_STOP_NO_REPLAY'}
if(Test-Path $backup){throw 'EXISTING_POLICY_BACKUP_STOP_NO_REPLAY'}
$profiles=@(Get-NetFirewallProfile|Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction)
if(@($profiles|Where-Object {$_.Enabled -ne 'False' -and $_.Enabled -ne 0}).Count){throw 'FIREWALL_PROFILE_CHANGED_AFTER_PRIOR_AUDIT'}
$rules=@(Get-NetFirewallRule -PolicyStore ActiveStore -ErrorAction Stop)
function inspectRule($name,$port,$protocol){
 $r=@($rules|Where-Object {$_.DisplayName -eq $name -and $_.Enabled -eq 'True' -and $_.Direction -eq 'Inbound' -and $_.Action -eq 'Allow'})
 $matched=@($r|Where-Object {
  $f=$_ | Get-NetFirewallPortFilter
  $f.Protocol -eq $protocol -and ($f.LocalPort -eq "$port" -or $f.LocalPort -eq 'Any')
 })
 return $matched.Count
}
$map=@(
 [pscustomobject]@{name='Foundry Port';port=30000;protocol='TCP'},
 [pscustomobject]@{name='Remote Desktop - User Mode (TCP-In)';port=3389;protocol='TCP'},
 [pscustomobject]@{name='Open Port for WorkflowAppControl';port=54950;protocol='TCP'},
 [pscustomobject]@{name='Steam';port=27036;protocol='TCP'},
 [pscustomobject]@{name='File and Printer Sharing (SMB-In)';port=445;protocol='TCP'}
)
$checks=@($map|ForEach-Object{[pscustomobject]@{name=$_.name;port=$_.port;protocol=$_.protocol;enabledActiveAllowCount=(inspectRule $_.name $_.port $_.protocol)}})
if(@($checks|Where-Object{$_.name -in @('Foundry Port','Remote Desktop - User Mode (TCP-In)','Open Port for WorkflowAppControl') -and $_.enabledActiveAllowCount -lt 1}).Count){throw 'CRITICAL_SERVICE_ALLOW_RULE_MISSING_STOP'}
$ls=@(Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -in @(30000,3389,27036,445,139,54950)} | Select-Object LocalAddress,LocalPort,OwningProcess)
& netsh advfirewall export $backup|Out-String|Write-Output
if($LASTEXITCODE -ne 0 -or !(Test-Path $backup) -or (Get-Item $backup).Length -lt 20000){throw 'FIREWALL_BACKUP_FAILED_NO_CHANGES'}
$report=[pscustomobject]@{mode='ADMIN_BACKUP_AUDIT_ONLY';when=[DateTime]::UtcNow.ToString('o');sha256=(Get-FileHash $backup -Algorithm SHA256).Hash.ToLowerInvariant();backup=$backup;profiles=$profiles;activeRuleCount=$rules.Count;serviceAllowChecks=$checks;listeners=$ls;appliedFirewallChanges=$false;explicitSMBDecisionNeeded=$true}
[System.IO.File]::WriteAllText($receipt,($report|ConvertTo-Json -Depth 6),(New-Object System.Text.UTF8Encoding($false)))
Write-Output ('AUDIT_SUCCESS_BACKUP_ONLY '+$receipt)
Write-Output ($checks|ConvertTo-Json -Compress -Depth 3)
Write-Output 'STOP: APPLY STEP NOT INCLUDED; SEPARATE SERVICE IMPACT DECISION REQUIRED.'