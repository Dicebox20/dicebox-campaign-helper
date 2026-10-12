$ErrorActionPreference='SilentlyContinue'
$dirs=@('C:\Windows\Media','C:\Users\rujie\Music','C:\Users\rujie\Downloads','C:\Users\rujie\Desktop','C:\Users\rujie\Documents\Audio')
$result=@()
foreach($dir in $dirs){
 if(!(Test-Path -LiteralPath $dir)){continue}
 $items=Get-ChildItem -LiteralPath $dir -File -Recurse -Depth 3 -ErrorAction SilentlyContinue |
  Where-Object {$_.Extension -in @('.wav','.mp3','.wma') -and $_.Name -match '(?i)(windows.?xp|xp.?startup|xp.?logon|startup.?xp)' }|
  Select-Object -First 20
 foreach($f in $items){$result+=[pscustomobject]@{path=$f.FullName;size=$f.Length}}
}
[pscustomobject]@{status='BOUNDED_SOUND_DISCOVERY';matched=$result.Count;results=$result}|ConvertTo-Json -Compress -Depth 4|Write-Output