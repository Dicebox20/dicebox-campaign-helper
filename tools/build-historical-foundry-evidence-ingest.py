from pathlib import Path
import hashlib,json,re,os,datetime
REPO=Path(os.environ['TEMP'])/'dicebox-foundry-evidence-ingest-20261007'
OUTM=REPO/'outputs/foundry-historical-evidence-manifest-2026-10-07.json'
OUTD=REPO/'docs/FOUNDRY-HISTORICAL-EVIDENCE-CATALOG-2026-10-07.md'
OUTS=REPO/'database/seed.d/2026-10-07-zzzz-foundry-historical-evidence.sql'
ROOTS={
'fc17':Path(r'C:\Users\rujie\Documents\Codex\2026-07-17\foundry-campaign-projects'),
'fc18':Path(r'C:\Users\rujie\Documents\Codex\2026-07-18\foundry-campaign-projects'),
'castle':Path(r'C:\Users\rujie\Documents\Codex\2026-07-14\castle-of-dreams'),
'uuid':Path(r'C:\Users\rujie\Documents\Codex\2026-06-25\what-can-i-do-with-codex'),
'dmf':Path(r'C:\Users\rujie\Documents\Codex\2026-06-25\can')}
def sh(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def bundle(ps,root=None):
 h=hashlib.sha256()
 for p in sorted(ps,key=lambda x:str(x).lower()):
  lbl=str(p.relative_to(root) if root and p.is_relative_to(root) else p).replace('\\','/')
  h.update(lbl.encode(errors='replace')+b'\0'+sh(p).encode()+b'\n')
 return h.hexdigest()
files={}
def add(k,p,cat):
 p=Path(p)
 if not p.is_file():return
 st=p.stat();files[str(p).lower()]={'root':k,'path':str(p),'relativePath':str(p.relative_to(ROOTS[k])).replace('\\','/'),'category':cat,'size':st.st_size,'modifiedUtc':datetime.datetime.fromtimestamp(st.st_mtime,datetime.timezone.utc).isoformat(),'sha256':sh(p)}
r=ROOTS['fc17']
for p in (r/'work/live-foundry-context/the-ballad-of-chauser-bill').glob('snapshot-*/extracts/*.md'):add('fc17',p,'live-world-snapshot-extract')
for rel in ['foundry-live-context-harness.ps1','README_CODEX_FOUNDATION.md','work/leveldb-tools/export-foundry-world-context.js','work/chauser-bill-scene-extract.md','work/chauser-bill-journal-extract.md','work/create-shield-loop-blue-world-macro.js','work/import-bralian-interceptor.js','work/patch-simon-maze-scene.js','work/patch-simon-tile-markers.js','work/simon-maze-corridor.dd2vtt','outputs/simon-maze-puzzle-order.md','outputs/compound-escape-tunnel-patrol-layout.md']:add('fc17',r/rel,'historical-foundry-implementation')
for p in (r/'outputs').glob('*.js'):add('fc17',p,'historical-foundry-macro')
for p in (r/'outputs/OldKnowledge').glob('*.js'):add('fc17',p,'historical-foundry-macro-legacy')
r=ROOTS['fc18']
for p in (r/'work').iterdir():
 if p.is_file() and p.suffix.lower() in {'.md','.json','.ps1'}:add('fc18',p,'campaign-foundry-evidence')
for p in (r/'outputs').glob('*.js'):add('fc18',p,'historical-foundry-macro')
for p in (r/'outputs').glob('*.md'):
 if any(x in p.name.lower() for x in ['castle','encounter','hint','quest']):add('fc18',p,'castle-foundry-context')
r=ROOTS['castle']
for p in (r/'work').iterdir():
 if p.is_file() and p.suffix.lower() in {'.mjs','.py','.json'}:add('castle',p,'castle-foundry-legacy-implementation')
r=ROOTS['uuid']
for p in (r/'outputs/foundry-item-uuids').glob('*'):
 if p.is_file() and p.suffix.lower() in {'.md','.csv'}:add('uuid',p,'foundry-uuid-extraction')
for rel in ['work/extract-foundry-item-uuids-leveldb.mjs','work/extract-foundry-item-uuids.ps1']:add('uuid',r/rel,'foundry-readonly-extractor')
r=ROOTS['dmf']
for rel in ['outputs/DUNGEON_MASTERS_FORGE_STATUS.md','outputs/foundry-vtt-dnd5e-item-forge-gpt-guide.md','outputs/codex-item-forge-request-to-spec-workflow.md','outputs/foundry-item-forge-custom-gpt-instructions.md','publish/dungeon-masters-forge-repo/module.json','publish/dungeon-masters-forge-repo/scripts/verify-project.ps1']:add('dmf',r/rel,'dmf-foundry-evidence')
for p in (r/'outputs').glob('codex-*-macro.js'):add('dmf',p,'dmf-foundry-test-macro')
files=sorted(files.values(),key=lambda x:(x['root'],x['relativePath'].lower()))
backups=[]
for d in sorted((ROOTS['castle']/'work').glob('scenes-backup-*')):
 if not d.is_dir():continue
 fs=[p for p in d.rglob('*') if p.is_file()];backups.append({'path':str(d),'fileCount':len(fs),'bytes':sum(p.stat().st_size for p in fs),'bundleSha256':bundle(fs,d)})
sroot=ROOTS['fc17']/'work/live-foundry-context/the-ballad-of-chauser-bill';snaps=[]
for d in sorted(sroot.glob('snapshot-*')):
 f=d/'extracts/context-summary.md'
 if not f.exists():continue
 t=f.read_text(encoding='utf-8-sig',errors='replace')
 def g(lbl):
  m=re.search(r'^- '+re.escape(lbl)+r':\s*(\d+)',t,re.M);return int(m.group(1)) if m else None
 ex=[p for p in (d/'extracts').glob('*.md') if p.is_file()]
 snaps.append({'snapshot':d.name,'storyJournalEntries':g('Story journal entries'),'scenes':g('Scenes scanned'),'macros':g('Macros scanned'),'playlists':g('Playlists scanned'),'relevantTables':g('Relevant tables scanned'),'extractBundleSha256':bundle(ex,d/'extracts')})
def sections(p):
 t=p.read_text(encoding='utf-8-sig',errors='replace');ms=list(re.finditer(r'^## (.+?)\s*$',t,re.M));return [(m.group(1).strip(),t[m.end():(ms[i+1].start() if i+1<len(ms) else len(t))]) for i,m in enumerate(ms)]
def fld(b,l):
 m=re.search(r'^- '+re.escape(l)+r':\s*(.*)$',b,re.M);return m.group(1).strip() if m else None
latest=sroot/'snapshot-20260717-150722/extracts';first=sroot/'snapshot-20260717-121321/extracts'
scenes=[]
for n,b in sections(latest/'scene-inventory.md'):
 c={};raw=fld(b,'Counts') or ''
 for part in raw.split(','):
  m=re.match(r'\s*([\w-]+)\s+(\d+)',part)
  if m:c[m.group(1)]=int(m.group(2))
 scenes.append({'name':n,'id':fld(b,'Scene ID'),'folder':fld(b,'Folder'),'dimensions':fld(b,'Dimensions'),'grid':fld(b,'Grid'),'counts':c,'created':fld(b,'Created'),'modified':fld(b,'Modified')})
macros=[{'name':n,'id':fld(b,'Macro ID'),'folder':fld(b,'Folder'),'scope':fld(b,'Scope'),'type':fld(b,'Type'),'created':fld(b,'Created'),'modified':fld(b,'Modified'),'preview':fld(b,'Preview')} for n,b in sections(latest/'macro-inventory.md')]
playlists=[{'name':n,'id':fld(b,'Playlist ID'),'folder':fld(b,'Folder'),'sounds':fld(b,'Sounds'),'created':fld(b,'Created'),'modified':fld(b,'Modified')} for n,b in sections(latest/'playlist-inventory.md')]
autos=[]
for n,b in sections(latest/'automation-signals.md'):
 row={'module':n,'scenes':[],'macros':[]}
 for lbl in ['Scenes','Macros']:
  v=fld(b,lbl)
  if v:row[lbl.lower()]=[x.strip() for x in v.split(',') if x.strip()]
 autos.append(row)
fs={n for n,_ in sections(first/'scene-inventory.md')};ls={n for n,_ in sections(latest/'scene-inventory.md')};fm={n for n,_ in sections(first/'macro-inventory.md')};lm={n for n,_ in sections(latest/'macro-inventory.md')}
evo={'scenesAdded':sorted(ls-fs),'scenesRemoved':sorted(fs-ls),'macrosAdded':sorted(lm-fm),'macrosRemoved':sorted(fm-lm)}
manifest={'schema':'dicebox-foundry-historical-evidence-manifest/v1','capturedAt':'2026-10-07','purpose':'Historical Foundry VTT evidence accumulated from other Codex project workspaces; provenance/evidence only, not automatic current runtime authority.','roots':{k:str(v) for k,v in ROOTS.items()},'selectedFileCount':len(files),'selectedBytes':sum(x['size'] for x in files),'files':files,'castleBackupBundles':backups,'liveWorldSnapshots':snaps,'latestHistoricalWorld':{'snapshot':'snapshot-20260717-150722','sceneCount':len(scenes),'macroCount':len(macros),'playlistCount':len(playlists),'automationModuleCount':len(autos),'evolutionFromFirstSnapshot':evo},'caveats':['2026-07-17 world snapshots are historical read-only extracts copied from Foundry LevelDB and do not prove current world state.','Legacy Castle scripts that directly opened Foundry LevelDB are historical evidence only and conflict with current no-raw-database-mutation rules.','2026-06-25 item UUID LevelDB extraction warned binary scanning was not a completeness guarantee.','DMF evidence was primarily Foundry v14.364 / DND5e 5.3.3 and requires current exact-stack reread before promotion.']}
OUTM.parent.mkdir(parents=True,exist_ok=True);OUTM.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8');msha=sh(OUTM)
def q(v):return 'NULL' if v is None else "'"+str(v).replace("'","''")+"'"
def slug(s):return re.sub(r'[^A-Za-z0-9]+','-',s).strip('-').upper()[:80] or 'X'
sources=[
('S-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-INGEST','Historical Foundry VTT Evidence Ingest','project','Historical Foundry VTT evidence accumulation from other Codex project workspaces','User-directed accumulation with SHA-256 source manifest and deterministic parsing','active','outputs/foundry-historical-evidence-manifest-2026-10-07.json; docs/FOUNDRY-HISTORICAL-EVIDENCE-CATALOG-2026-10-07.md','2026-10-07',msha,'Index/manifest; historical evidence is not current runtime authority.'),
('S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','The Ballad of Chauser Bill live Foundry snapshot series','verification','Historical read-only Foundry world snapshots','Copied/extracted Foundry world LevelDB snapshot evidence','historical',str(sroot),'2026-07-17',bundle([p for p in latest.glob('*.md') if p.is_file()],latest),'Eight snapshots from 12:13 through 15:07 on 2026-07-17.'),
('S-HIST-20260719-CHAUSER-FOUNDRY-SESSION-LOG','The Ballad of Chauser Bill Foundry session log','verification','Historical live Foundry verification and campaign implementation notes','Session log with explicit live Foundry verification results','historical',str(ROOTS['fc18']/'work/chauser-bill-session-log.md'),'2026-07-19',sh(ROOTS['fc18']/'work/chauser-bill-session-log.md'),'Includes MATT and Midi-QOL tile verification and item repair evidence.'),
('S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','Castle of Dreams historical Foundry implementation scripts','project','Historical Castle Scene/wall/teleport/RegionBehavior implementation','Original scripts from 2026-07-14 and 2026-07-18','historical',str(ROOTS['castle'])+'; '+str(ROOTS['fc18']/'outputs'),'2026-07-18',bundle([p for p in [ROOTS['castle']/'work/rebuild_castle_teleports.mjs',ROOTS['castle']/'work/apply_castle_scene_padding_to_teleports.mjs',ROOTS['castle']/'work/patch_kitchen_walls.mjs',ROOTS['fc18']/'outputs/castle-of-dreams-auto-wire-teleports.js'] if p.exists()]),'Direct-LevelDB scripts are legacy anti-pattern evidence; later RegionBehavior script uses document APIs.'),
('S-HIST-20260625-FOUNDRY-ITEM-UUID-EXTRACTION','Historical Foundry item UUID extraction corpus','verification','Read-only Foundry item UUID extraction from local data root','Historical extraction summaries and CSVs','historical',str(ROOTS['uuid']/'outputs/foundry-item-uuids'),'2026-06-25',bundle([p for p in (ROOTS['uuid']/'outputs/foundry-item-uuids').glob('*') if p.is_file()]),'Corpus-scale evidence; not current runtime authority or guaranteed completeness.'),
('S-HIST-20260701-DMF-FOUNDRY-EVIDENCE',"Dungeon Master's Forge Foundry v14/DND5e 5.3.3 evidence corpus",'verification','Historical tested Foundry item-authoring/module behavior','DMF status, guide, test macros and verifier','historical',str(ROOTS['dmf']/'outputs'),'2026-07-01',bundle([ROOTS['dmf']/'outputs/DUNGEON_MASTERS_FORGE_STATUS.md',ROOTS['dmf']/'outputs/foundry-vtt-dnd5e-item-forge-gpt-guide.md',ROOTS['dmf']/'outputs/codex-item-forge-request-to-spec-workflow.md']),'Historical exact-stack evidence primarily Foundry v14.364 / DND5e 5.3.3.')]
facts=[]
def F(i,d,t,s,src,tags):facts.append((i,d,None,t,s,'historical','historical','locked',src,None,tags))
for s in snaps:F('F-HIST-20260717-'+s['snapshot'].replace('snapshot-',''),'foundry.historical.world-snapshot','Historical Foundry world snapshot '+s['snapshot'],f"Read-only snapshot recorded {s['storyJournalEntries']} story journals, {s['scenes']} scenes, {s['macros']} macros, {s['playlists']} playlists, {s['relevantTables']} filtered relevant tables; extract bundle SHA-256 {s['extractBundleSha256']}.",'S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry snapshot historical')
F('F-HIST-20260717-SNAPSHOT-EVOLUTION','foundry.historical.world-snapshot','Historical Chauser Bill snapshot evolution',f"Scene count changed {snaps[0]['scenes']} -> {snaps[-1]['scenes']} and macro count {snaps[0]['macros']} -> {snaps[-1]['macros']}. Added scenes: {', '.join(evo['scenesAdded'])}; added macros: {', '.join(evo['macrosAdded'])}; none removed by name.",'S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry snapshot chronology')
for s in scenes:
 counts=', '.join(f'{k}={v}' for k,v in s['counts'].items());F('F-HIST-20260717-SCENE-'+s['id'],'foundry.historical.scene','Historical Scene: '+s['name'],f"Snapshot 20260717-150722 recorded Scene ID {s['id']}, folder {s['folder']}, dimensions {s['dimensions']}, {s['grid']}, counts {counts}, created {s['created']}, modified {s['modified']}. Historical binding only.",'S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry scene historical '+s['id'])
for m in macros:F('F-HIST-20260717-MACRO-'+m['id'],'foundry.historical.macro','Historical Macro: '+m['name'],f"Snapshot 20260717-150722 recorded Macro ID {m['id']}, folder {m['folder']}, scope {m['scope']}, type {m['type']}, created {m['created']}, modified {m['modified']}, preview {repr((m['preview'] or '')[:180])}.",'S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry macro historical '+m['id'])
for p in playlists:F('F-HIST-20260717-PLAYLIST-'+p['id'],'foundry.historical.playlist','Historical Playlist: '+p['name'],f"Snapshot 20260717-150722 recorded Playlist ID {p['id']}, sounds {p['sounds']}, created {p['created']}, modified {p['modified']}.",'S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry playlist historical')
for a in autos:F('F-HIST-20260717-AUTOMATION-'+slug(a['module']),'foundry.historical.automation','Historical automation signal: '+a['module'],f"Snapshot 20260717-150722 detected {a['module']} references across {len(a['scenes'])} named scenes and {len(a['macros'])} named macros; scenes: {', '.join(a['scenes']) or 'none'}; macros: {', '.join(a['macros']) or 'none'}.",'S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry automation '+a['module'])
manual=[
('F-HIST-20260719-MATT-8OF8-HURTHEAL','foundry.historical.live-verification','MATT tile enter/hurtheal 8/8 live verification','The 2026-07-19 session log says eight tiles on The Index Corridor - Escape Scene were verified live as 8/8 token-enter -> hurtheal -> -[[3d6]] against the triggering token.','S-HIST-20260719-CHAUSER-FOUNDRY-SESSION-LOG','foundry live MATT 8/8'),
('F-HIST-20260719-MATT-MIDIQOL-LIGHTNING-8OF8','foundry.historical.live-verification','MATT runmacro plus Midi-QOL lightning 8/8 live verification','The 2026-07-19 session log says the generic hurtheal action was replaced with runmacro calling Codex - Tile Lightning Damage, using MidiQOL.applyTokenDamage with forceApply true for typed 3d6 lightning; live verification reported 8/8 enter -> runmacro (GM).','S-HIST-20260719-CHAUSER-FOUNDRY-SESSION-LOG','foundry live MATT MidiQOL 8/8'),
('F-HIST-20260719-CAPSULE-EQUIPMENT-REPAIR','foundry.historical.item','Assistant Deployment Capsule equipment-style repair','Historical campaign state records consumable-style was incompatible with intended loot behavior; converting to equipment-style and rerunning Create Compound Escape Tunnel Loot was recorded working.','S-HIST-20260719-CHAUSER-FOUNDRY-SESSION-LOG','foundry dnd5e item repair'),
('F-HIST-20260714-CASTLE-LEVELDB-LEGACY','foundry.historical.legacy-implementation','Castle direct-LevelDB Scene mutation is legacy evidence only',"The 2026-07-14 scripts imported Foundry internal level-database.mjs and directly manipulated Scene sublevels. Preserve as historical implementation/anti-pattern evidence only; current DiceBox rules prohibit raw database/world-file mutation.",'S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry leveldb legacy anti-pattern'),
('F-HIST-20260714-CASTLE-TELEPORT-TILES','foundry.historical.legacy-implementation','Castle MATT teleport tile implementation','rebuild_castle_teleports.mjs encoded 32 directed Castle links as Tile documents with monks-active-tiles enter triggers and teleport actions targeting destination Scene IDs and x/y coordinates. The direct LevelDB write is legacy only.','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry MATT teleport historical'),
('F-HIST-20260714-CASTLE-PADDING-COORDINATES','foundry.historical.legacy-implementation','Castle teleport padding coordinate correction','apply_castle_scene_padding_to_teleports.mjs shifted source and destination coordinates by round(scene.width*padding), round(scene.height*padding), then marked coordinateFrame=scene-padding-v1. Evidence that Scene padding changes the relevant coordinate frame.','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry scene padding coordinates'),
('F-HIST-20260714-CASTLE-KITCHEN-WALLS','foundry.historical.legacy-implementation','Castle Kitchen historical wall set','patch_kitchen_walls.mjs defined eight line-segment Walls for Castle of Dreams - A1 - Kitchen, including one door wall, with movement/light/sight/sound restrictions. Direct LevelDB write is legacy; line-segment wall geometry remains historical evidence.','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry wall line door historical'),
('F-HIST-20260718-CASTLE-REGIONBEHAVIOR-TELEPORT','foundry.historical.regionbehavior','Castle RegionBehavior teleport document pattern','castle-of-dreams-auto-wire-teleports.js paired reciprocal Region names and created/updated/deduplicated type=teleportToken RegionBehavior embedded documents with destination Region UUIDs, center placement, snap true, choice false, revealed true and transition duration.','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry RegionBehavior teleportToken'),
('F-HIST-20260625-ITEM-UUID-SCAN-1150','foundry.historical.data-extraction','Historical Foundry item UUID structured extraction','A historical extraction summary recorded 1,150 compendium-item UUID rows and explicitly noted binary scanning was not a completeness guarantee.','S-HIST-20260625-FOUNDRY-ITEM-UUID-EXTRACTION','foundry item uuid corpus'),
('F-HIST-20260625-ITEM-UUID-LEVELDB-107335','foundry.historical.data-extraction','Historical Foundry LevelDB item UUID corpus','The LevelDB summary reports 255 databases and 107,335 item UUID rows: 58,205 world-item, 49,129 compendium-item, 1 actor-embedded-item; Ballad of Chauser Bill contributed 27,643. Historical corpus evidence, not current completeness proof.','S-HIST-20260625-FOUNDRY-ITEM-UUID-EXTRACTION','foundry item uuid leveldb corpus'),
('F-HIST-20260625-INTO-FEYWILD-ITEM-TYPES','foundry.historical.data-extraction','Into the Feywild historical item-type distribution','Historical extraction recorded 17,794 UUID rows: 6,012 compendium and 11,782 world; types included spell 4,442, equipment 4,269, weapon 3,741, base 2,230, consumable 1,310, loot 555, container 437, tool 320, feat 296, Item 128, enchantment 66.','S-HIST-20260625-FOUNDRY-ITEM-UUID-EXTRACTION','foundry dnd5e item types corpus')]
for row in manual:F(*row)
dmf=[
('REFERENCE-ENV','DMF historical reference environment','DMF guide records Foundry v14.364, DND5e 5.3.3, Midi-QOL 14.0.9, DAE 14.0.12 and Item Macro 3.0.1 for Into the Feywild; historical exact-stack only.'),
('NATIVE-FIRST','DMF native-first tested item-authoring rule','DMF records core DND5e activities, uses and Active Effects as the most reliable tested approach before module-specific automation.'),
('ACTIVITY-ID-16','DND5e activity IDs tested at 16 alphanumeric characters','DMF records DND5e v5.3.3 activity _id values must be exactly 16 alphanumeric characters; this fixed a 15-character Dewdrop Vial validation failure.'),
('ITEM-FOLDER','Item.create folder placement historical test','DMF testing recorded folder: folder.id inside Item.create data worked; relying on {folder: folder.id} as the second argument produced an empty folder and root item in that tested stack.'),
('NATIVE-ENCHANT','Native DND5e enchant activity historical proof','DMF recorded a working native enchant activity using CONFIG.DND5E.activityTypes.enchant.documentClass plus an embedded ActiveEffect type=enchantment.'),
('NATIVE-SUMMON','Native DND5e summon activity historical proof','DMF recorded working native summon activities using CONFIG.DND5E.activityTypes.summon.documentClass with Actor UUID profiles; Wolfcall Charm and Catguard Plate were reported working.'),
('MULTIPROFILE-SUMMON','Native multi-profile summon historical proof','DMF recorded one native summon activity with multiple profiles displaying a selection dropdown; profiles had separate 16-character IDs and Actor UUIDs.'),
('EQUIPMENT-ATTACK','Equipment attack activity historical proof','DMF recorded a non-weapon equipment attack from CONFIG.DND5E.activityTypes.attack.documentClass; Helm of the Psimaster attack plus summon workflow was reported fully successful.'),
('DIRECT-TOKEN-LIGHT','Direct token light update replaced ATL historical failure','DMF records ATL.light.* Active Effect keys failed for the tested toggle; direct TokenDocument light updates with prior state stored in token flags were reliable.'),
('2-21-7-LIVE','DMF 2.21.7 live Foundry verification','DMF status records 2.21.7 installed, Items shortcuts and Forge Settings/panes visible after reload, saved endpoint/model/token surviving full Foundry reload, and live provider connection behavior.'),
('DIAGNOSTICS-6OF6','DMF non-destructive diagnostics 6/6','DMF status records built-in diagnostics passing 6/6 in DMF Test World without creating documents; earlier v2.16 verification likewise reported 6/6 without world-document creation.'),
('DND5E-RESOLVER','DMF read-only DND5e content resolver','DMF 2.19.0 added read-only exact-name Spell/Equipment lookup returning source UUID provenance and compatibility details without importing or mutating compendium documents.')]
for key,title,st in dmf:F('F-HIST-20260701-DMF-'+key,'foundry.historical.dmf',title,st,'S-HIST-20260701-DMF-FOUNDRY-EVIDENCE','foundry dnd5e DMF tested historical')
trials=[
('T-HIST-20260719-CAPSULE-ITEM-TYPE','foundry historical item compatibility','Assistant Deployment Capsule loot behavior incompatible when modeled consumable-style.','Convert to equipment-style and rerun loot macro.','Item type mismatched intended deployment behavior.','Preserve equipment-style unless current evidence disproves it.','Historical working correction.','S-HIST-20260719-CHAUSER-FOUNDRY-SESSION-LOG'),
('T-HIST-20260719-MATT-DAMAGE-REFINEMENT','foundry historical tile automation','Generic MATT hurtheal worked but was untyped.','Replace with runmacro and MidiQOL.applyTokenDamage.','Generic action did not express typed damage semantics.','World macro applied typed 3d6 lightning; 8/8 runmacro(GM) historically verified.','Historical live verification.','S-HIST-20260719-CHAUSER-FOUNDRY-SESSION-LOG'),
('T-HIST-20260714-CASTLE-PADDING','foundry historical coordinates','Castle teleports required coordinate correction after Scene padding.','Shift source/target by round(width*padding), round(height*padding).','Authored image frame differed from padded Scene frame.','Mark corrected coordinate frame scene-padding-v1.','Historical implementation; direct DB mutation obsolete.','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION'),
('T-HIST-20260701-DMF-ACTIVITY-ID','foundry dnd5e item authoring','Dewdrop Vial failed with 15-character activity ID.','Require 16 alphanumeric characters.','Historical DND5e 5.3.3 validation required 16 characters.','Use 16-character IDs in historical pattern and revalidate current stack.','Historical DMF correction.','S-HIST-20260701-DMF-FOUNDRY-EVIDENCE'),
('T-HIST-20260701-DMF-ITEM-FOLDER','foundry dnd5e item authoring','Item appeared at root while folder was empty.','Put folder id in Item.create data.','Second-argument folder option did not place item in tested stack.','Use document-data folder field in historical pattern.','Historical DMF correction.','S-HIST-20260701-DMF-FOUNDRY-EVIDENCE'),
('T-HIST-20260701-DMF-LIGHT-TOGGLE','foundry token lighting','ATL.light.* effect path was unreliable.','Use scripted utility activity and direct TokenDocument light update with restore flag.','Historical module effect path failed target workflow.','Direct token update plus flag restore worked historically.','Historical DMF correction.','S-HIST-20260701-DMF-FOUNDRY-EVIDENCE')]
tools=[
('T-HIST-FOUNDRY-LIVE-CONTEXT-HARNESS','historical-foundry-corpus','Historical Foundry Evidence','foundry-live-context-harness.ps1','harness','powershell -File foundry-live-context-harness.ps1',str(ROOTS['fc17']/'foundry-live-context-harness.ps1'),'Copies selected world DB folders excluding LOCK and runs a read-only extractor.','Historical read-only acquisition only.','historical','S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry snapshot read-only'),
('T-HIST-FOUNDRY-WORLD-CONTEXT-EXTRACTOR','historical-foundry-corpus','Historical Foundry Evidence','export-foundry-world-context.js','query','node export-foundry-world-context.js',str(ROOTS['fc17']/'work/leveldb-tools/export-foundry-world-context.js'),'Extracts Scene/Macro/Playlist/journal/automation inventories from copied DB data.','Historical read-only extractor.','historical','S-HIST-20260717-CHAUSER-LIVE-WORLD-SNAPSHOTS','foundry extraction'),
('T-HIST-FOUNDRY-ITEM-UUID-LEVELDB','historical-foundry-corpus','Historical Foundry Evidence','extract-foundry-item-uuids-leveldb.mjs','query','node extract-foundry-item-uuids-leveldb.mjs',str(ROOTS['uuid']/'work/extract-foundry-item-uuids-leveldb.mjs'),'Read-only historical scanner used for large UUID corpus.','Historical static extraction; not guaranteed complete.','historical','S-HIST-20260625-FOUNDRY-ITEM-UUID-EXTRACTION','foundry uuid leveldb'),
('T-HIST-CASTLE-REGION-TELEPORT-AUTOWIRE','historical-foundry-corpus','Historical Foundry Evidence','castle-of-dreams-auto-wire-teleports.js','adapter','Foundry Script Macro',str(ROOTS['fc18']/'outputs/castle-of-dreams-auto-wire-teleports.js'),'Creates/updates/deduplicates teleportToken RegionBehavior documents by reciprocal Region name.','Historical document-API pattern; revalidate current runtime.','historical','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry RegionBehavior teleport'),
('T-HIST-CASTLE-LEVELDB-TELEPORT-BUILDER','historical-foundry-corpus','Historical Foundry Evidence','rebuild_castle_teleports.mjs','harness','node rebuild_castle_teleports.mjs',str(ROOTS['castle']/'work/rebuild_castle_teleports.mjs'),'Historically built MATT teleport Tiles via direct LevelDB writes.','Legacy anti-pattern; current rules forbid raw DB mutation.','historical','S-HIST-20260714-18-CASTLE-FOUNDRY-IMPLEMENTATION','foundry legacy leveldb teleport'),
('T-HIST-DMF-PROJECT-VERIFIER','historical-foundry-corpus','Historical Foundry Evidence','DMF verify-project.ps1','verifier','powershell -File scripts/verify-project.ps1',str(ROOTS['dmf']/'publish/dungeon-masters-forge-repo/scripts/verify-project.ps1'),'Historical DMF source/package verifier.','Historical verification only.','historical','S-HIST-20260701-DMF-FOUNDRY-EVIDENCE','foundry dmf verifier')]
rels=[('R-2026-10-07-HIST-FOUNDRY-'+x[0].split('-')[-1],'source','S-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-INGEST','indexes','source',x[0],'Manifest fingerprints source corpus.') for x in sources[1:]]
sql=[]
sql.append('-- Historical Foundry VTT evidence accumulation from other Codex projects')
sql.append('-- Historical evidence does not supersede current exact-runtime authority.\n')
sql.append("INSERT OR REPLACE INTO kb_metadata(key,value) VALUES ('historical_foundry_evidence_ingest_version','2026-10-07.v1'),('historical_foundry_evidence_manifest_sha256',%s),('historical_foundry_evidence_selected_files',%s);\n" % (q(msha),q(str(len(files)))))
sql.append("INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES\n" + ',\n'.join('('+','.join(q(x) for x in row)+')' for row in sources) + ';\n')
sql.append("INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES\n" + ',\n'.join('('+','.join(q(x) for x in row)+')' for row in facts) + ';\n')
src_ids=','.join(q(x[0]) for x in sources)
sql.append("INSERT INTO facts_fts(fact_id,title,statement,tags) SELECT fact_id,title,statement,tags FROM kb_facts WHERE source_id IN ("+src_ids+");\n")
sql.append("INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES\n" + ',\n'.join('('+','.join(q(x) for x in row)+')' for row in trials) + ';\n')
sql.append("INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction) SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials WHERE source_id IN ("+src_ids+");\n")
sql.append("INSERT OR REPLACE INTO kb_tools(tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags) VALUES\n" + ',\n'.join('('+','.join(q(x) for x in row)+')' for row in tools) + ';\n')
sql.append("INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags) SELECT tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags FROM kb_tools WHERE source_id IN ("+src_ids+");\n")
sql.append("INSERT OR REPLACE INTO kb_relationships(relationship_id,from_type,from_id,relation,to_type,to_id,notes) VALUES\n" + ',\n'.join('('+','.join(q(x) for x in row)+')' for row in rels) + ';\n')
OUTS.write_text('\n'.join(sql),encoding='utf-8')
doc=['# Historical Foundry VTT Evidence Catalog â€” 2026-10-07','','**Status:** imported historical evidence; does not supersede current exact-runtime authority','','This pass accumulates Foundry evidence from older Codex workspaces into the reproducible DiceBox Campaign Helper KB. Historical scripts are evidence of what was tried or observed, not permission to reuse obsolete mutation techniques.','','## Corpus imported','',f"- SHA-256 fingerprinted **{len(files)} selected files** ({sum(x['size'] for x in files):,} bytes) across five older Codex project roots.",f"- Indexed **{len(snaps)}** read-only live-world snapshots from 2026-07-17.",f"- Parsed the final historical snapshot into **{len(scenes)} Scenes**, **{len(macros)} Macros**, **{len(playlists)} Playlists**, and **{len(autos)} automation/module signal groups**.",f"- Fingerprinted **{len(backups)}** Castle Scene-database backup bundles without copying raw databases into the canonical repository.","- Added explicit 2026-07-19 live Foundry verification for 8/8 Monk's Active Tiles damage triggers and the later 8/8 Midi-QOL runmacro lightning configuration.",'- Added Castle wall/teleport/RegionBehavior implementation evidence, UUID corpus evidence, and Dungeon Master\'s Forge tested DND5e patterns.','','## Snapshot chronology','','| Snapshot | Journals | Scenes | Macros | Playlists | Tables |','|---|---:|---:|---:|---:|---:|']
for s in snaps:doc.append(f"| {s['snapshot']} | {s['storyJournalEntries']} | {s['scenes']} | {s['macros']} | {s['playlists']} | {s['relevantTables']} |")
doc+=['',f"First-to-final added Scenes: **{', '.join(evo['scenesAdded'])}**. Added Macros: **{', '.join(evo['macrosAdded'])}**. No names were removed in the same comparison.",'','## High-value lessons','','- Real campaign Scenes used Walls, Tokens, Tiles, Lights, Drawings, Notes, and occasional Regions at widely varying densities; per-Scene facts preserve historical counts and dimensions.','- Historical automation signals include Monk\'s Active Tiles, Tagger, Sequencer, Midi-QOL, DAE, Levels, FXMaster, and Regions.','- Castle work preserves MATT Tile teleports and later RegionBehavior teleportToken wiring.','- Castle padding evidence shows coordinate frames must explicitly account for Scene padding.','- DMF provides tested historical evidence for native DND5e enchant/summon/attack activities, 16-character activity IDs, Item.create folder behavior, and direct TokenDocument lighting after an ATL-based failure.','- The UUID corpus is useful at scale but explicitly distinguishes binary extraction from guaranteed runtime completeness.','','## Authority and safety','','- Do not reuse 2026-07-14 direct LevelDB mutation scripts as current DiceBox implementation; current rules prohibit raw database/world-file mutation.','- Historical Foundry v14.364 evidence does not certify v14.367 behavior. Current mutation still needs current exact-target authority, versioned public adapters, authoritative reread, and receipts.','- Campaign-specific names/IDs are historical bindings, not global semantics.','- The manifest stores hashes and bundle fingerprints rather than copying whole legacy worlds into GitHub.','','## Canonical artifacts','','- outputs/foundry-historical-evidence-manifest-2026-10-07.json','- database/seed.d/2026-10-07-zzzz-foundry-historical-evidence.sql','- This catalog']
OUTD.write_text('\n'.join(doc)+'\n',encoding='utf-8')
print(json.dumps({'selectedFiles':len(files),'selectedBytes':sum(x['size'] for x in files),'backupBundles':len(backups),'snapshots':len(snaps),'scenes':len(scenes),'macros':len(macros),'playlists':len(playlists),'automationGroups':len(autos),'facts':len(facts),'trials':len(trials),'tools':len(tools),'manifestSha256':msha},indent=2))
