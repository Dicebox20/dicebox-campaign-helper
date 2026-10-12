from __future__ import annotations
from pathlib import Path
from datetime import datetime, timezone
import sqlite3,json,hashlib,base64,subprocess,os
from collections import Counter

ROOT=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
ORIGINAL=Path(r'C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\work\lodge-campaign')
OUT=ROOT/'handoffs/catalog-2026-10-08'
PREVIOUS=ROOT/'handoffs/catalog-2026-10-07'
HANDOFF=ROOT/'handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-08.md'
DB=ROOT/'database/dicebox_campaign_helper_knowledge.sqlite'
HARNESS=ROOT/'work/foundry-playwright-harness'
TABLES=['kb_decisions','kb_facts','kb_metadata','kb_milestones','kb_open_items','kb_relationships','kb_research_subjects','kb_sources','kb_tools','kb_trials']
utc=lambda:datetime.now(timezone.utc).isoformat()
def sha(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  while True:
   chunk=f.read(1024*1024)
   if not chunk:break
   h.update(chunk)
 return h.hexdigest()
def dump(path,obj):
 path.parent.mkdir(parents=True,exist_ok=True)
 path.write_text(json.dumps(obj,ensure_ascii=False,indent=1,default=str)+'\n',encoding='utf-8')
def safe_value(x):
 if isinstance(x,bytes):return {'encoding':'base64','data':base64.b64encode(x).decode()}
 return x
def capture(script):
 proc=subprocess.run(['node','exec-page.mjs','read',script],cwd=HARNESS,capture_output=True,encoding='utf-8',timeout=75)
 if proc.returncode:raise SystemExit('STOP Foundry read-only failed '+script+': '+proc.stderr[:400])
 obj=json.loads(proc.stdout)
 if obj.get('status')!='PASS' or obj.get('identity',{}).get('worldId')!='the-lost-mine-of-phandalin':
  raise SystemExit('STOP wrong Foundry context: '+script)
 return obj
print('PHASE1 Foundry read-only scenes, C1 and regression...',flush=True)
scene_live=capture('cl92-interior-scene-grid-baseline-readonly-v001.page.js')
c1=capture('clscale-c1-final-readonly-v001.page.js')
cl90=capture('cl90-progress-safety-smoke-v013.page.js')
scenes=scene_live['result']['scenes']
grids={s['id']:s['grid']['size'] for s in scenes}
expected={'0CSBwzcszPKyaB8u':150,'5K1uASAARnX8aZhP':240,'EDdktL7VUihbpKe9':240,
'JZkxX6lUQe8Nc8xJ':320,'LXTA8mx1rJ2L6e2J':240,'UNySMm7YkyYfh41x':120,'pHQvDUDlyWZFuNrX':120}
if len(scenes)!=21 or any(grids.get(i)!=v for i,v in expected.items()):
 raise SystemExit('STOP grid drift, no catalog success')
if c1['result'].get('status')!='PASS_SOURCE_AND_GEOMETRY_IDENTICAL' or cl90['result'].get('status')!='PASS_WITH_KNOWN_BLOCKERS' or cl90['result'].get('failures'):
 raise SystemExit('STOP latest live C1 or CL90 failed')
if cl90['result']['baseline']!={'scenes':21,'regions':202,'behaviors':119,'stableIds':119,'disabled':1,'itemCount':33,'revision':3,'kernelHash':'6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814'}:
 raise SystemExit('STOP roster/ledger revision drift')
scene_rows=[]
for a in scenes:
 scene_rows.append({'scene_id':a['id'],'name':a['name'],'grid':a['grid'],
  'image_dimensions_px':{'width':a['dimensions']['width'],'height':a['dimensions']['height']},
  'image_source':a.get('backdrop'),'stats':a['stats'],
  'tokens':a['stats'].get('tokens'),'scene_active':a.get('active')})
liv={'schema_version':'1.0.0','generated_utc':utc(),'world':scene_live['result']['stack'],
     'source_method':'read-only Foundry Scene documents; no runtime writes',
     'scenes':scene_rows,'c1_final_read_only':c1['result'],
     'cl90_v013':cl90['result']}
OUT.mkdir(parents=True,exist_ok=True)
dump(OUT/'live-central-lodge-scene-inventory.json',liv)
print('PHASE1 PASS',len(scene_rows),'Scenes',flush=True)

print('PHASE2 canonical KB metadata and ALL first-class rows...',flush=True)
uri='file:'+DB.resolve().as_posix()+'?mode=ro'
with sqlite3.connect(uri,uri=True) as db:
 db.row_factory=sqlite3.Row
 db.execute('BEGIN')
 integrity=db.execute('PRAGMA integrity_check').fetchone()[0]
 fk=db.execute('PRAGMA foreign_key_check').fetchall()
 if integrity!='ok' or fk:raise SystemExit('STOP KB integrity or foreign keys failure')
 schemas={};data={};counts={};views={};vc={}
 for table in TABLES:
  quoted='"'+table.replace('"','""')+'"'
  row=db.execute('SELECT sql FROM sqlite_master WHERE type="table" AND name=?',(table,)).fetchone()
  if row is None:raise SystemExit('STOP table absent '+table)
  cols=[dict(x) for x in db.execute('PRAGMA table_info('+quoted+')')]
  values=[{k:safe_value(r[k]) for k in r.keys()} for r in db.execute('SELECT * FROM '+quoted)]
  counts[table]=len(values)
  schemas[table]=row['sql']
  data[table]={'columns':cols,'rows':values}
 for row in db.execute("SELECT name,sql FROM sqlite_master WHERE type='view' ORDER BY name"):
  views[row['name']]=row['sql']
  try:vc[row['name']]=db.execute('SELECT count(*) FROM "'+row['name'].replace('"','""')+'"').fetchone()[0]
  except sqlite3.Error as err:vc[row['name']]={'error':str(err)}
 selected_facts={r['fact_id']:r for r in db.execute("SELECT fact_id,title,status,source_id FROM kb_facts WHERE fact_id LIKE 'F-2026-10-08-CL-SCALE-%' OR fact_id='F-2026-10-08-FOREMAN-HANDOFF-C1-CURRENT-LIVE'")}
 decision=db.execute("SELECT decision_id,status,source_id FROM kb_decisions WHERE decision_id='D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM'").fetchone()
 item=db.execute("SELECT item_id,status,next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()
 if not decision or decision['status']!='locked' or not item or item['status']!='in_progress' or 'C2' not in item['next_action']:
  raise SystemExit('STOP KB policy/next action drift')
 if 'F-2026-10-08-FOREMAN-HANDOFF-C1-CURRENT-LIVE' not in selected_facts:
  raise SystemExit('STOP handoff fact not published')
 meta={'description':'Complete first-class KB table data and schema; no redundant FTS shadow rows',
    'schema_version':'1.0.0','generated_utc':utc(),'root':str(ROOT),
    'sqlite_integrity':integrity,'foreign_key_violations':len(fk),
    'table_counts':counts,'table_schemas':schemas,'tables':data,
    'view_schemas':views,'view_counts':vc,
    'current_calibration_decision':dict(decision),
    'calibration_open_item':dict(item),
    'current_scale_facts':[dict(x) for x in selected_facts.values()]}
 db.execute('ROLLBACK')
dump(OUT/'all-kb-data-and-metadata.json',meta)
print('PHASE2 PASS',counts,flush=True)

print('PHASE3 on-disk file metadata SHA-256...',flush=True)
SECRET_WORDS=('access-token','password','credential','secret','.env','oauth','cookie','session-store','private-key')
EXCLUDE_PARTS={'.git','node_modules','__pycache__','.venv','.cache'}
EXCLUDE_FILES={'dicebox_campaign_helper_knowledge.sqlite-wal','dicebox_campaign_helper_knowledge.sqlite-shm'}
files=[];skipped=[];errors=[];totalbytes=0;rootcounts=Counter()
def add_tree(root,name,files_to_visit):
 global totalbytes
 for p in files_to_visit:
  try:
   if not p.is_file() or p.is_symlink():continue
   rel=p.relative_to(root).as_posix()
   lower=rel.lower()
   reason=None
   if any(part in EXCLUDE_PARTS for part in p.relative_to(root).parts):reason='dependency/cache excluded'
   elif any(word in lower for word in SECRET_WORDS):reason='secret-like filename; no content or hash exported'
   elif p.name in EXCLUDE_FILES:reason='volatile SQLite journal'
   elif name=='foreman_project' and rel.startswith('handoffs/catalog-2026-10-08/'):reason='self-referential catalog output'
   elif name=='foreman_project' and rel=='outputs/LATEST-FOREMAN-CHECKPOINT.json':reason='mutable last-checkpoint alias; target is updated after export'
   if reason:
    skipped.append({'root':name,'relative_path':rel,'reason':reason})
    continue
   stat=p.stat()
   record={'root':name,'relative_path':rel,'bytes':stat.st_size,'modified_utc':datetime.fromtimestamp(stat.st_mtime,timezone.utc).isoformat(),
    'sha256':sha(p)}
   files.append(record);totalbytes+=stat.st_size;rootcounts[name]+=1
  except Exception as err:
   errors.append({'root':name,'path':str(p),'error':str(err)})
foreman=list(ROOT.rglob('*'))
add_tree(ROOT,'foreman_project',foreman)
previous=json.loads((PREVIOUS/'project-file-metadata-sha256.json').read_text(encoding='utf-8'))
external_refs=sorted({entry['relative_path'] for entry in previous['files'] if entry['root']=='original_lodge_source'})
if not ORIGINAL.exists():raise SystemExit('STOP external source tree missing')
external=[ORIGINAL/rel for rel in external_refs]
missing_external=[rel for rel in external_refs if not (ORIGINAL/rel).is_file()]
add_tree(ORIGINAL,'original_lodge_source',external)
manifest={'schema_version':'1.0.0','generated_utc':utc(),
  'scope':'Per-file metadata and SHA-256 for project and selected canonical original lodge source; never raw credentials or binary asset copies',
  'roots':{'foreman_project':str(ROOT),'original_lodge_source':str(ORIGINAL)},
  'external_related_repo':str(ORIGINAL.parent.parent),
  'external_related_repo_note':'External giant original authoring repo is selectively catalogued via the 2026-10-07 original-authoring manifest paths; not copied wholesale',
  'files':sorted(files,key=lambda x:(x['root'],x['relative_path'])),
  'skipped_files':skipped,'errors':errors,
  'totals':{'files_hashed':len(files),'hashed_bytes':totalbytes,'foreman_project_files':rootcounts['foreman_project'],
           'original_lodge_source_files':rootcounts['original_lodge_source'],
           'missing_external_referenced_files':len(missing_external),
           'skipped_files':len(skipped)}}
dump(OUT/'project-file-metadata-sha256.json',manifest)
print('PHASE3 hashed',len(files),'bytes',totalbytes,'errors',len(errors),'missing_external',len(missing_external),flush=True)

print('PHASE4 integrity receipt...',flush=True)
expected_backup_names=['clscale-m2-before-grid320-v001.json','clscale-m3-before-grid240-v001.json',
 'clscale-b2-before-grid240-v001.json','clscale-b1-before-grid150-v001.json','clscale-c1-before-grid240-v001.json']
backups={name:(ROOT/'outputs/foreman-checkpoints'/name).is_file() for name in expected_backup_names}
c2_scripts=[p.name for p in HARNESS.glob('clscale-c2*')]
checklist={
 'all_10_canonical_tables_exported':len(TABLES)==len(counts)==len(data),
 'all_kb_rows_exported':all(counts[k]==len(data[k]['rows']) for k in TABLES),
 'all_foreman_scene_grid_values_match_expected':all(grids.get(k)==v for k,v in expected.items()),
 'live_C1_already_applied':c1['result'].get('status')=='PASS_SOURCE_AND_GEOMETRY_IDENTICAL',
 'CL90_v013_zero_unexpected_failures':cl90['result'].get('failures')==[],
 'kb_rebuilt_integrity_ok':integrity=='ok',
 'kb_no_foreign_key_violations':len(fk)==0,
 'five_original_Scene_backups_present':all(backups.values()),
 'no_C2_staged_APPLY_or_backup':not c2_scripts and not list((ROOT/'outputs/foreman-checkpoints').glob('clscale-c2-before-grid*')),
 'source_file_read_errors_zero':len(errors)==0,
 'external_81_original_references_present':len(missing_external)==0
}
resources={}
for key,p in [('handoff',HANDOFF),('kb_snapshot',OUT/'all-kb-data-and-metadata.json'),
               ('file_manifest',OUT/'project-file-metadata-sha256.json'),
               ('live_scene_inventory',OUT/'live-central-lodge-scene-inventory.json'),
               ('sqlite_database',DB)]:
 resources[key]={'path':str(p),'bytes':p.stat().st_size,'sha256':sha(p)}
receipt={'schema_version':'1.0.0','generated_utc':utc(),
 'status':'PASS' if all(checklist.values()) else 'BLOCKED',
 'self_consistency_checks':checklist,
 'files':manifest['totals'],'file_read_errors':errors,'missing_external_references':missing_external,
 'kb_table_counts':counts,'kb_sqlite_integrity':integrity,'kb_foreign_key_errors':len(fk),
 'resources':resources,'five_grid_backups':backups,
 'next_exact_scene':'C2 Cult Records & Ritual Undercroft UNySMm7YkyYfh41x 120px grid, candidate 160, no C2 writes',
 'outcome_unknown':'No known Foundry write in this cataloging work unit. Current Bridge old delivery outcome remains unverified; no send/retry.'}
dump(OUT/'catalog-integrity.json',receipt)
print('CATALOG_RESULT',receipt['status'],'CHECKS',checklist,flush=True)
if receipt['status']!='PASS':raise SystemExit('STOP catalog receipt BLOCKED, inspect catalog-integrity.json')
print('CATALOG_READY',OUT,flush=True)
