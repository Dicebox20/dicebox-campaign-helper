const fs=require("node:fs"),crypto=require("node:crypto");
let s=fs.readFileSync("cl50-t3-f1-source-v001.txt","utf8");
const replacements=[
["__diceboxCl50T3F1Transition","__diceboxCl50T3N3Return"],
["Tkg7XpsF7X1P3ZVJ","YElrtisbXN3DJ2Sw"],
["La9krMOMBhAhDLi6","pHQvDUDlyWZFuNrX"],
["zKNU1R3JGIMMt017","RP1jYOH738xl9hks"],
["dbx:central-lodge:f1:region:transition:t3-arrival","dbx:central-lodge:n3:region:n3-branch-railway"],
["dbx:central-lodge:f1","dbx:central-lodge:n3"],
["Ancient Passage — GM Travel Confirmation","Return to Depot — GM Travel Confirmation"],
["The abandoned railway has ended; the older passage continues beyond it.","The abandoned spur reconnects with the Collection Vaults railway branch."],
["Confirm the character intends to proceed into the <strong>Ancient Infernal Threshold (F1)</strong>.","Confirm the character intends to return to <strong>Collection Vaults / Underground Depot (N3)</strong>."],
["Proceed to F1","Return to N3"],
["[DiceBox CL-50 T3→F1]","[DiceBox CL-50 T3→N3]"]
];
for(const [a,b] of replacements){if(!s.includes(a))throw Error("Expected template term missing "+a);s=s.replaceAll(a,b);}
const sha=crypto.createHash("sha256").update(s).digest("hex");
fs.writeFileSync("cl50-t3-n3-return-source-v001.txt",s);
console.log("SOURCE_GENERATED "+s.length+" SHA256 "+sha);
