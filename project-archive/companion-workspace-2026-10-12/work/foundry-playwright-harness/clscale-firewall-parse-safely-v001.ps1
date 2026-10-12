$ErrorActionPreference='Stop'
$target='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\clscale-firewall-elevated-backup-audit-v001.ps1'
$tokens=$null;$errors=$null
[System.Management.Automation.Language.Parser]::ParseFile($target,[ref]$tokens,[ref]$errors)|Out-Null
if(@($errors).Count){$errors|ForEach-Object{Write-Output ('PARSE_ERROR '+$_.Message)};exit 3}
Write-Output 'ELEVATED_AUDIT_SCRIPT_PARSE_PASS_NO_EXECUTION'