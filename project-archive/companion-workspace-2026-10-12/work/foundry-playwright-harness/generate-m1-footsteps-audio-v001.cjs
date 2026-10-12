"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const sampleRate=48000,seconds=5.5,n=Math.round(sampleRate*seconds),channels=2,pcm=Buffer.alloc(n*channels*2),seed=0x46cd21ae;let rng=seed>>>0;
const rand=()=>((rng=(1664525*rng+1013904223)>>>0)/4294967296)*2-1;
const v=new Float64Array(n),noise=new Float64Array(n);let low=0;for(let i=0;i<n;i++){low=0.87*low+0.13*rand();noise[i]=low;}
const feet=[0.75,1.52,2.44,3.28,4.12];
for(const t of feet){
 const start=Math.floor(t*sampleRate),dur=0.23*sampleRate,amp=0.29;
 for(let k=0;k<dur&&start+k<n;k++){
  const sec=k/sampleRate,env=Math.sin(Math.PI*Math.min(1,sec/0.23))**2*(1-sec/0.23);
  const body=Math.sin(2*Math.PI*(82-25*sec)*sec)*Math.exp(-sec*17);
  v[start+k]+=amp*env*(0.75*noise[start+k]+0.25*body);
 }
 // board creak after each muted step
 for(let k=0;k<0.7*sampleRate;k++){
  const idx=start+Math.floor(0.1*sampleRate)+k;if(idx>=n)break;
  const tsec=k/sampleRate;const e=Math.sin(Math.PI*Math.min(1,tsec/0.7))**2*Math.exp(-tsec*3);
  const chirp=Math.sin(2*Math.PI*(217*tsec-102*tsec*tsec/2)+0.25*Math.sin(2*Math.PI*7*tsec));
  v[idx]+=0.07*e*chirp;
 }
}
for(let i=0;i<n;i++){const t=i/sampleRate;const ramp=Math.min(1,t/0.5,(seconds-t)/0.65);v[i]+=0.016*Math.max(0,ramp)*noise[i]*Math.sin(Math.PI*Math.min(1,t/seconds))**2;}
// Two muted tail taps serve as a restrained room reflection, not a sharp impulse.
const resultL=new Float64Array(n),resultR=new Float64Array(n);
for(let i=0;i<n;i++){
 const a=v[i],r1=i>=Math.floor(.137*sampleRate)?v[i-Math.floor(.137*sampleRate)]:0,r2=i>=Math.floor(.249*sampleRate)?v[i-Math.floor(.249*sampleRate)]:0;
 resultL[i]=a*.75+r1*.15+r2*.08;
 resultR[i]=a*.68+r1*.12+r2*.18;
}
let peak=0;for(let i=0;i<n;i++)peak=Math.max(peak,Math.abs(resultL[i]),Math.abs(resultR[i]));
const scale=peak>0?0.36/peak:1;
const header=Buffer.alloc(44);header.write("RIFF",0);header.writeUInt32LE(36+pcm.length,4);header.write("WAVE",8);header.write("fmt ",12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(channels,22);header.writeUInt32LE(sampleRate,24);header.writeUInt32LE(sampleRate*channels*2,28);header.writeUInt16LE(channels*2,32);header.writeUInt16LE(16,34);header.write("data",36);header.writeUInt32LE(pcm.length,40);
for(let i=0;i<n;i++){const env=Math.min(1,i/(sampleRate*.3),(n-i)/(sampleRate*.6));for(let c=0;c<channels;c++){const x=Math.max(-1,Math.min(1,(c?resultR[i]:resultL[i])*scale*env));pcm.writeInt16LE(Math.round(x*32767),(i*channels+c)*2);}}
const data=Buffer.concat([header,pcm]);
const file=path.join("assets","cl52","audio","m1-distant-footsteps-v001.wav");
if(fs.existsSync(file))throw Error("Original asset already exists; refuse overwrite");
fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data,{flag:"wx"});
const sha=crypto.createHash("sha256").update(data).digest("hex");
const manifest={assetId:"dbx:central-lodge:cl52:audio:m1-distant-footsteps-v001",createdBy:"original procedural synthesis, no third-party samples",intendedScene:"M1",cue:"GM-triggered distant footsteps",path:file,foundryAssetPath:"worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m1-distant-footsteps-v001.wav",sha256:sha,bytes:data.length,sampleRate,channels,seconds,format:"WAV PCM16 stereo",peakTarget:0.36,notes:"Subtle floorboard steps and creaks; no sharp strobe-like beats; playback should be moderate volume and manually GM-authorized."};
fs.writeFileSync(path.join(path.dirname(file),"m1-distant-footsteps-v001.manifest.json"),JSON.stringify(manifest,null,2)+"\n",{flag:"wx"});
console.log("CL52_AUDIO_ASSET_GENERATED "+JSON.stringify(manifest));
