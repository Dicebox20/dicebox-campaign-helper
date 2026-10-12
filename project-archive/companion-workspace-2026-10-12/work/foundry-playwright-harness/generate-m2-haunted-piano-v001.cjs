"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const sr=48000,dur=6.0,n=Math.round(sr*dur),v=new Float64Array(n),left=new Float64Array(n),right=new Float64Array(n);
let seed=0x32bb89d9;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296*2-1);
const events=[
{at:.62,frequency:174.61,vol:.33,decay:2.1},
{at:1.87,frequency:185.00,vol:.27,decay:2.9},
{at:3.24,frequency:261.63,vol:.19,decay:1.9},
{at:3.47,frequency:277.18,vol:.18,decay:1.8},
{at:4.54,frequency:164.81,vol:.17,decay:2.4},
];
for(const e of events){
 const start=Math.floor(e.at*sr);
 for(let k=0;k<sr*e.decay&&k+start<n;k++){
  const t=k/sr,attack=Math.min(1,t/.012),env=attack*Math.exp(-t*(2.4/e.decay)),w=e.frequency*2*Math.PI*t;
  const detune=.11*Math.sin(2*Math.PI*.22*t);
  const partial=Math.sin(w)+.32*Math.sin(w*2+detune)+.17*Math.sin(w*3+.12)+.08*Math.sin(w*4+.04);
  const hammer=(rand()*.08)*Math.exp(-t*52);
  const x=e.vol*env*(partial/1.65+hammer);
  v[start+k]+=x;
 }
}
let h=0;
for(let i=0;i<n;i++){
 h=h*.995+rand()*.005;
 const t=i/sr;
 v[i]+=0.010*h*Math.min(1,t/.5,(dur-t)/.5);
 if(t>2.72&&t<3.0){const u=t-2.72;v[i]+=.009*Math.sin(2*Math.PI*(115*u+130*u*u))*Math.sin(Math.PI*u/.28)**2;}
}
const delay=(t)=>Math.floor(sr*t);
for(let i=0;i<n;i++){
 const a=v[i],l=v[i-delay(.177)]??0,r=v[i-delay(.291)]??0;
 left[i]=a*.70+l*.14+r*.06;
 right[i]=a*.64+l*.10+r*.17;
}
let peak=0;for(let i=0;i<n;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
const scale=peak?0.30/peak:1;
const pcm=Buffer.alloc(n*4),header=Buffer.alloc(44);header.write("RIFF",0);header.writeUInt32LE(36+pcm.length,4);header.write("WAVEfmt ",8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(sr,24);header.writeUInt32LE(sr*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write("data",36);header.writeUInt32LE(pcm.length,40);
for(let i=0;i<n;i++){const f=Math.max(0,Math.min(1,i/(sr*.22),(n-i)/(sr*.45)));pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,left[i]*scale*f))*32767),i*4);pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,right[i]*scale*f))*32767),i*4+2);}
const out=Buffer.concat([header,pcm]),filepath=path.join("assets","cl52","audio","m2-haunted-piano-v001.wav");
if(fs.existsSync(filepath))throw Error("Asset exists; refuse overwrite");
fs.mkdirSync(path.dirname(filepath),{recursive:true});fs.writeFileSync(filepath,out,{flag:"wx"});
const sha=crypto.createHash("sha256").update(out).digest("hex");
const manifest={assetId:"dbx:central-lodge:cl52:audio:m2-haunted-piano-v001",createdBy:"Original procedural additive synthesis; no third-party samples or recognizable melody",scene:"M2",sourcePlan:"M2 PREPARE v001 Haunted piano cue, independent of Piano Roll mechanism",assetPath:filepath,foundryAssetPath:"worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m2-haunted-piano-v001.wav",sha256:sha,bytes:out.length,sampleRate:sr,channels:2,seconds:dur,format:"WAV PCM16 stereo",peakTarget:.30,notes:"Five isolated uneven, dissonant felt-piano tones with gentle wooden resonance; no jump-scare or strobe. GM-only controlled manual one-shot."};
fs.writeFileSync(path.join(path.dirname(filepath),"m2-haunted-piano-v001.manifest.json"),JSON.stringify(manifest,null,2)+"\n",{flag:"wx"});
console.log("CL52_M2_ASSET_GENERATED",JSON.stringify(manifest));
