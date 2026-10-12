const fs=require("node:fs"),crypto=require("node:crypto");
let s=fs.readFileSync("cl50-t3-f1-source-v001.txt","utf8");
const replacements=[
["__diceboxCl50T3F1Transition","__diceboxCl50E1M1Entrance"],
["Tkg7XpsF7X1P3ZVJ","QS7OpvIilyyDpmLc"],
["aIKQmFiuXWipEdyb","Zq8iXByDVhHRbA7w"],
["zKNU1R3JGIMMt017","4b8vfvKAKXBS6kfW"],
["La9krMOMBhAhDLi6","U8S5ZrTjaPIkTUIL"],
["dbx:central-lodge:f1:region:transition:t3-arrival","dbx:central-lodge:m1:region:m1-transition-main-door"],
["dbx:central-lodge:f1","dbx:central-lodge:m1"],
["Ancient Passage — GM Travel Confirmation","Lodge Entrance — GM Travel Confirmation"],
["The abandoned railway has ended; the older passage continues beyond it.","The front door of the abandoned lodge opens into the old entrance hall."],
["Confirm the character intends to proceed into the <strong>Ancient Infernal Threshold (F1)</strong>. This is not an automatic forced move.","Confirm that the character wants to enter the <strong>Main Lodge Entrance Hall (M1)</strong>. This is a voluntary move, not an automatic forced transition."],
["Proceed to F1","Enter the Lodge"],
["Remain in T3","Remain Outside"],
["[DiceBox CL-50 T3→F1]","[DiceBox CL-50 E1→M1]"]
];
for(const [a,b] of replacements)if(!s.includes(a))throw Error("Missing template "+a);else s=s.replaceAll(a,b);
const sha=crypto.createHash("sha256").update(s).digest("hex");
fs.writeFileSync("cl50-e1-m1-front-door-source-v001.txt",s);
let t=fs.readFileSync("cl50-t3-f1-offline-test.cjs","utf8");
for(const [a,b] of replacements){if(t.includes(a))t=t.replaceAll(a,b);}
t=t.replaceAll("cl50-t3-f1-source-v001.txt","cl50-e1-m1-front-door-source-v001.txt");
t=t.replaceAll("CL50 T3 F1 OFFLINE MOCK","CL50 E1 M1 OFFLINE MOCK");
fs.writeFileSync("cl50-e1-m1-front-door-offline-test.cjs",t);
console.log("CL50_E1M1_SOURCE_STAGED_SHA256",sha,"LENGTH",s.length);
