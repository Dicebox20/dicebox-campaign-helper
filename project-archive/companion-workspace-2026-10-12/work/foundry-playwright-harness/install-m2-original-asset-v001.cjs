"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),path=require("node:path");
const project="C:\\Users\\rujie\\Documents\\Codex\\DiceBox Campaign Helper";
const a=path.join(project,"assets","cl52","audio","m2-haunted-piano-v001.wav");
const folder="C:\\Users\\rujie\\AppData\\Local\\FoundryVTT\\Data\\worlds\\the-lost-mine-of-phandalin\\assets\\dicebox-cl52",b=path.join(folder,"m2-haunted-piano-v001.wav");
const expected="d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9";
const sha=buf=>crypto.createHash("sha256").update(buf).digest("hex"),src=fs.readFileSync(a);
if(sha(src)!==expected)throw Error("Master asset checksum drift");
if(src.length!==1152044)throw Error("Master length mismatch");
fs.mkdirSync(folder,{recursive:true});
if(fs.existsSync(b)){if(sha(fs.readFileSync(b))!==expected)throw Error("Existing foreign file collision");console.log("ASSET_ALREADY_MATCHES")}else{fs.copyFileSync(a,b,fs.constants.COPYFILE_EXCL);console.log("ASSET_COPY_CREATED")}
if(sha(fs.readFileSync(b))!==expected)throw Error("Destination SHA mismatch");
console.log("FOUNDRY_M2_AUDIO_SHA_PASS",expected,"BYTES",src.length);
