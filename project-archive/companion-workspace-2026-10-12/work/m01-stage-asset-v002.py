import hashlib,zipfile,os,pathlib,sys
source=pathlib.Path(r"C:\Users\rujie\Downloads\M01_Forgotten_Road_BUILD_v001.zip")
target=pathlib.Path(os.environ["LOCALAPPDATA"])/"FoundryVTT"/"Data"/"worlds"/"the-forgotten-realms"/"assets"/"dicebox-expedition"/"M01_Forgotten_Road_final.png"
expected_zip="0ae2c48af60c374a03c4d831d862abdd875b3af84d0a9cf1e4c6b764dc1690d4"
expected_image="dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a"
def sha(b):return hashlib.sha256(b).hexdigest()
assert sha(source.read_bytes())==expected_zip, "zip hash mismatch"
with zipfile.ZipFile(source) as z:
 data=z.read("M01_Forgotten_Road_final.png")
assert sha(data)==expected_image, "image hash mismatch"
target.parent.mkdir(parents=True,exist_ok=True)
if target.exists():
 assert sha(target.read_bytes())==expected_image, "existing mismatch, do not overwrite"
 print("ALREADY_STAGED",target)
else:
 tmp=target.with_suffix(".tmp")
 assert not tmp.exists(), "temporary exists: abort"
 tmp.write_bytes(data)
 os.replace(tmp,target)
 print("STAGED",target)
assert sha(target.read_bytes())==expected_image
print("PASS",target.stat().st_size,sha(target.read_bytes()))
