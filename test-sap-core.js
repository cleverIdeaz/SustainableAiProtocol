const assert = require("node:assert/strict");
const test = require("node:test");
const SAP = require("./sap-core");
const base = [
 {id:"local",label:"Local",location:"local",quality:0.86,costUSD:0.01,latencyMs:2200,energyKwh:0.0008,energyEvidence:"measured",energyNote:"Illustrative"},
 {id:"cloud",label:"Cloud",location:"remote",quality:0.92,costUSD:0.005,latencyMs:600,energyKwh:0.0003,energyEvidence:"estimated",energyNote:"Illustrative"},
 {id:"unknown",label:"Unknown",location:"remote",quality:0.99,costUSD:null,latencyMs:300,energyKwh:null,energyEvidence:"unknown"}
];
test("balanced chooses lowest declared cost after quality floor",()=>{
 const r=SAP.evaluate(base,{mode:"balanced"});
 assert.equal(r.selected.id,"cloud");
 assert.equal(r.provisional,true);
});
test("eco chooses least declared energy but warns of estimates/missing values",()=>{
 const r=SAP.evaluate(base,{mode:"eco"});
 assert.equal(r.selected.id,"cloud");
 assert.equal(r.provisional,true);
 assert.match(r.reason,/estimates|provider claims/i);
});
test("performance chooses highest qualifying quality proxy",()=>{
 assert.equal(SAP.evaluate(base,{mode:"performance"}).selected.id,"unknown");
});
test("local-only actually excludes remote execution",()=>{
 const r=SAP.evaluate(base,{mode:"eco",localOnly:true});
 assert.equal(r.selected.id,"local");
 assert.equal(r.rejected.length,2);
});
test("quality floor cannot be ignored",()=>{
 assert.equal(SAP.evaluate(base,{minimumQuality:1}).selected,null);
});
test("missing energy does not become zero",()=>{
 const r=SAP.evaluate([{...base[0],energyKwh:null,energyEvidence:"unknown"}],{mode:"eco"});
 assert.equal(r.selected,null);
 assert.match(r.reason,/Insufficient/);
});
test("invalid evidence and negative energy rejected",()=>{
 assert.throws(()=>SAP.evaluate([{...base[0],energyKwh:-1}]));
 assert.throws(()=>SAP.evaluate([{...base[0],energyEvidence:"unknown"}]));
});
test("duplicate IDs rejected",()=>{
 assert.throws(()=>SAP.evaluate([base[0],base[0]]),/Duplicate/);
});
test("human-review requirement actually excludes unsuitable paths",()=>{
 const r=SAP.evaluate([{...base[0],humanReview:true},base[1]],{humanReview:true});
 assert.equal(r.selected.id,"local");
});
test("receipt never includes prompts and doesn't claim verification",()=>{
 const receipt=SAP.makeReceipt(base[0],{demo:true});
 assert.equal(receipt.outcome.status,"planned");
 assert.equal(receipt.privacy.promptContentIncluded,false);
 assert.equal(receipt.privacy.transmittedBySAPCore,false);
 assert.throws(()=>SAP.makeReceipt(base[0],{status:"verified"}),/reference/);
 assert.equal(SAP.makeReceipt(base[0],{status:"verified",verificationReference:"test:123"}).outcome.status,"verified");
});
test("no network or storage side effects",()=>{
 const oldFetch=global.fetch;
 const oldStorage=global.localStorage;
 global.fetch=()=>{throw Error("Unwanted network");};
 global.localStorage={setItem(){throw Error("Unwanted storage");}};
 try{SAP.evaluate(base);SAP.makeReceipt(base[0]);}finally{global.fetch=oldFetch;global.localStorage=oldStorage;}
});
