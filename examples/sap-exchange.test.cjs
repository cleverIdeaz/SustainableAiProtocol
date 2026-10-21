"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const cp=require("node:child_process"),path=require("node:path");
const {assertEnvelope}=require("../protocol/validate.cjs");
const {choose}=require("./sap-consumer.cjs");
const py=path.join(__dirname,"sap-producer.py");
function offer(locality,option,exchange,quality){
 const result=cp.spawnSync("python3",[py,"--locality",locality,"--option",option,"--exchange",exchange,"--illustrative-quality",String(quality)],{encoding:"utf8",timeout:5000});
 if(result.status!==0)throw Error(result.stderr||"Python producer failed");
 const value=JSON.parse(result.stdout);assertEnvelope(value);return value;
}
test("Python producer and JS consumer exchange SAP records under strict local-only policy",()=>{
 const a=offer("on_device","local","integration-one",.80);
 const b=offer("remote","cloud","integration-one",.95);
 const d=choose([a,b],{localOnly:true,mode:"performance",minQuality:.75});
 assert.equal(d.payload.selected_offer_id,a.id);
 assert.equal(d.payload.policy.local_only,true);
 assert.equal(d.payload.provisional,true);assertEnvelope(d);
});
test("performance may select remote if locally prohibited constraint is absent",()=>{
 const a=offer("on_device","local","integration-two",.80);
 const b=offer("remote","cloud","integration-two",.95);
 assert.equal(choose([a,b],{mode:"performance"}).payload.selected_offer_id,b.id);
});
test("unknown energy cannot win eco preference as imaginary zero",()=>{
 const a=offer("on_device","local","integration-three",.80);
 const b=offer("remote","cloud","integration-three",.95);
 const d=choose([a,b],{mode:"eco"});
 assert.equal(d.payload.selected_offer_id,null);
 assert.equal(d.payload.reason_code,"no_eligible_offer");
});
test("cross-task or cross-exchange offers are rejected",()=>{
 const a=offer("on_device","local","one",.80),b=offer("remote","remote","two",.95);
 assert.throws(()=>choose([a,b]),/Exchange mismatch/);
});
test("unverified metric value cannot claim measured source",()=>{
 const a=offer("on_device","local","one",.80);
 a.payload.metrics.energy_kwh.value=0;
 assert.throws(()=>assertEnvelope(a));
});
