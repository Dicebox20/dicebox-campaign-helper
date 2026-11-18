import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const script = readFileSync(new URL('../tools/dch-main-launcher-audit.ps1', import.meta.url), 'utf8');

test('audits the executable in the actual workstation source, not PR50', () => {
  assert.match(script, /dch-workstation-layout-v001/);
  assert.match(script, /target\\release\\dicebox-campaign-helper-desktop\.exe/);
  assert.match(script, /workspace-chat\.ts/);
  assert.match(script, /siwc_direct_chat\.rs/);
  assert.doesNotMatch(script, /dch-m0-pr50-fresh-main-verify/);
});

test('audits current Git and executable provenance without claiming a build', () => {
  assert.match(script, /rev-parse/);
  assert.match(script, /--porcelain=v1/);
  assert.match(script, /Get-FileHash/);
  assert.match(script, /Get-CimInstance Win32_Process/);
  assert.match(script, /UNKNOWN_UNTIL_REPRODUCIBLE_BUILD_RECEIPT/);
  assert.match(script, /NOT_DETERMINABLE_FROM_THIS_AUDIT/);
});

test('contains no mutation or executable launch command', () => {
  for (const verb of ['Copy-Item', 'Move-Item', 'Remove-Item', 'Set-Content', 'Out-File',
    'Start-Process', 'Stop-Process', 'cargo build', 'npm run', 'git reset', 'git stash', 'git checkout']) {
    assert.doesNotMatch(script, new RegExp(`\\b${verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'), `Unexpected write/run verb ${verb}`);
  }
});


test('verifies explicit production bin target before release review', () => {
  assert.match(script, /PRODUCTION_LAUNCHER_BIN_TARGET_MISSING/);
  assert.match(script, /productionLauncherBinDeclared/);
});