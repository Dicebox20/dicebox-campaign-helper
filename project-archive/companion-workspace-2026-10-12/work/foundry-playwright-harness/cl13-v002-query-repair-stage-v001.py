from pathlib import Path
import hashlib
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
src=(root/'cl13-seventh-winter-clock-region-source-v001.js').read_text(encoding='utf-8')
orig={
 'else chosen = await requester.query("dialog",{type:"input",config:cfg},{timeout:45000});':'else chosen = await Dialog.query(requester,"input",cfg);',
 'else await requester.query("dialog",{type:"prompt",config:wrong},{timeout:20000});':'else await Dialog.query(requester,"prompt",wrong);',
 'if (movement.user?.id && movement.user.id !== requester.id) return;\n':''
}
for old,new in orig.items():
 if src.count(old)!=1:raise SystemExit('STOP unrecognized v001 source '+str(src.count(old)))
 src=src.replace(old,new,1)
src=src.replace('// One approved primary-active GM performs the ledger write. Player enters clock Region.','// Primary-active GM performs ledger write; remote user prompts use official DialogV2.query.\n// Player enters clock Region. This source is staged and not yet installed.',1)
dst=root/'cl13-seventh-winter-clock-region-source-v002.js'
if dst.exists():raise SystemExit('STOP v002 already exists; never overwrite without review')
dst.write_text(src,encoding='utf-8')
test=(root/'cl13-seventh-winter-source-offline-v001.cjs').read_text(encoding='utf-8')
test=test.replace("'cl13-seventh-winter-clock-region-source-v001.js'","'cl13-seventh-winter-clock-region-source-v002.js'")
old=' remote.query=async(type,details)=>{calls.query++;return decline?null:answer};'
if test.count(old)!=1:raise SystemExit('STOP old mock query not found')
test=test.replace(old,' // User instances do not expose .query; DialogV2.query provides remote delivery.',1)
old=' query:async()=>{calls.query++;return decline?null:answer},'
if test.count(old)!=1:raise SystemExit('STOP old Dialog query mock not found')
test=test.replace(old,''' query:async(user,type,config)=>{
  assert.equal(user.id,remote.id,'Dialog.query must target the moving User');
  assert(['input','prompt'].includes(type),'Dialog.query type must be input or prompt');
  assert.equal(typeof config.content,'string');
  calls.query++;
  if(type==='prompt') { calls.prompt++;return null; }
  return decline?null:answer;
 },''',1)
test+='''\ntest('wrong remote answer shows response to same User, no ledger commit',async()=>{
 const x=await invoke({answer:{hour:3,minute:35}});
 assert.equal(x.calls.query,2);assert.equal(x.calls.prompt,1);assert.equal(x.calls.writes,0);
});
test('correct remote answer never calls nonexistent requester.query method',async()=>{
 const x=await invoke({answer:{hour:4,minute:35}});
 assert.equal(x.calls.query,1);assert.equal(x.calls.writes,1);
});
test('official dialog input and remote query are different functions',async()=>{
 const x=await invoke({player:false});
 assert.equal(x.calls.input,1);assert.equal(x.calls.query,0);
});
'''
tdst=root/'cl13-seventh-winter-source-offline-v002.cjs'
if tdst.exists():raise SystemExit('STOP tests v002 already exist')
tdst.write_text(test,encoding='utf-8')
print('STAGED_V002_SOURCE',dst.name,'SHA256',hashlib.sha256(src.encode()).hexdigest())
print('STAGED_V002_TESTS',tdst.name,'SHA256',hashlib.sha256(test.encode()).hexdigest())
print('V001_SOURCE_UNCHANGED',hashlib.sha256((root/'cl13-seventh-winter-clock-region-source-v001.js').read_bytes()).hexdigest())
