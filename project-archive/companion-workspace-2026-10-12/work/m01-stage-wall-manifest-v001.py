import zipfile,json,hashlib,pathlib,os
source=pathlib.Path(r"C:\Users\rujie\Downloads\M01_Forgotten_Road_BUILD_v001.zip")
root=pathlib.Path(os.environ["LOCALAPPDATA"])/"FoundryVTT"/"Data"/"worlds"/"the-forgotten-realms"/"assets"/"dicebox-expedition"
target=root/"M01_build_manifest.json"
with zipfile.ZipFile(source) as z: data=z.read("M01_build_manifest.json")
m=json.loads(data); walls=m["geometry"]["walls"]
assert len(walls)==156
assert m["build_id"]=="dicebox-m01-forgotten-road-stage-v001"
assert m["scene_name"]=="M01 — The Forgotten Road"
assert m["sha256"]=="dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a"
assert len({w["id"] for w in walls})==156
assert "roadside half-walls" in " ".join(m["geometry"]["excluded_from_wall_generation"])
assert not any("roadside" in w["group"].lower() for w in walls)
outlier=[]
for w in walls:
 c=w["c"]
 if len(c)!=4 or not all(type(v) in (int,float) and v>=0 and (v<=1536 if i%2==0 else v<=1024) for i,v in enumerate(c)) or c[:2]==c[2:]:
  outlier.append(w)
assert not outlier, f"Invalid walls: {len(outlier)}"
root.mkdir(parents=True,exist_ok=True)
if target.exists():
 assert target.read_bytes()==data,"Refusing existing manifest overwrite"
 state="ALREADY_STAGED"
else:
 target.write_bytes(data);state="STAGED"
print(state, str(target),len(data),"SHA256",hashlib.sha256(data).hexdigest(),"walls",len(walls),"groups",len({w["group"] for w in walls}))
