"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {fromOtlpTraces}=require("./otlp-bridge.cjs");
const {toImpactManifest}=require("./impact-framework.cjs");
function payload(overrides={}){
 const attributes=[
  {key:"gen_ai.operation.name",value:{stringValue:"chat"}},
  {key:"gen_ai.request.model",value:{stringValue:"local-model"}},
  {key:"gen_ai.provider.name",value:{stringValue:"ollama"}},
  {key:"gen_ai.usage.input_tokens",value:{intValue:"17"}},
  {key:"gen_ai.usage.output_tokens",value:{intValue:"9"}},
  {key:"gen_ai.input.messages",value:{stringValue:"DO NOT STORE THIS"}},
  {key:"user.email",value:{stringValue:"secret@example.com"}}
 ];
 const span={traceId:"0123456789abcdef0123456789abcdef",spanId:"0123456789abcdef",startTimeUnixNano:"1792580000000000000",endTimeUnixNano:"1792580001234000000",attributes,...overrides};
 return {resourceSpans:[{resource:{attributes:[{key:"service.name",value:{stringValue:"sap-pilot"}}]},scopeSpans:[{spans:[span]}]}]};
}
test("OpenTelemetry span translates latency, provider token data, and redacts content",()=>{
 const x=fromOtlpTraces(payload())[0],s=JSON.stringify(x);
 assert.equal(x.measurements.durationMs.value,1234);
 assert.equal(x.measurements.inputTokens.value,17);
 assert.equal(x.measurements.outputTokens.value,9);
 assert.equal(x.measurements.energyKwh.value,null);
 assert.equal(x.measurements.energyKwh.evidence,"unknown");
 assert.ok(!s.includes("DO NOT STORE"));assert.ok(!s.includes("secret@example.com"));
});
test("unprovided tokens remain unknown, not zero",()=>{
 const x=fromOtlpTraces(payload({attributes:[{key:"gen_ai.operation.name",value:{stringValue:"chat"}},{key:"gen_ai.request.model",value:{stringValue:"local-model"}}]}))[0];
 assert.equal(x.measurements.inputTokens.value,null);
 assert.equal(x.measurements.inputTokens.evidence,"unknown");
});
test("invalid OTLP observations rejected",()=>{
 assert.throws(()=>fromOtlpTraces({resourceSpans:new Array(51).fill({})}),/Too many/);
 assert.throws(()=>fromOtlpTraces(payload({endTimeUnixNano:"1792570000000000000"})),/before start/);
});
test("Impact Framework requires energy and grid provenance, never invents metrics",()=>{
 assert.throws(()=>toImpactManifest({energyKwh:null,gridIntensityGPerKwh:250,timestamp:"2026-10-21T09:00:00Z",durationS:1,source:{energy:"meter",grid:"utility"}}),/Energy/);
 assert.throws(()=>toImpactManifest({energyKwh:.001,gridIntensityGPerKwh:250,timestamp:"2026-10-21T09:00:00Z",durationS:1,source:{}}),/provenance/);
 const x=toImpactManifest({energyKwh:.001,gridIntensityGPerKwh:250,timestamp:"2026-10-21T09:00:00Z",durationS:1,source:{energy:"fixture-meter",grid:"fixture-grid"}});
 assert.equal(x.claim,"operational-carbon-only");
 assert.match(x.manifest,/method: Multiply/);
 assert.ok(!x.manifest.includes("method: Sci"));
});
test("only with separate embodied input does manifest invoke full IF Sci",()=>{
 const x=toImpactManifest({energyKwh:.001,gridIntensityGPerKwh:250,embodiedGco2e:.1,timestamp:"2026-10-21T09:00:00Z",durationS:1,source:{energy:"fixture-meter",grid:"fixture-grid",embodied:"fixture-lca"}});
 assert.match(x.manifest,/method: Sci/);
 assert.match(x.manifest,/functional-unit: requests/);
 assert.match(x.manifest,/embodied-carbon: 0.1/);
});
test("two separately instantiated apps exchange OTLP HTTP JSON and never invent energy",async()=>{
 const {server}=require("./receiver.cjs");
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 try{
  const p=server.address().port;
  const r=await fetch("http://127.0.0.1:"+p+"/v1/traces",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload())});
  assert.equal(r.status,200);
  const got=await(await fetch("http://127.0.0.1:"+p+"/observations")).json();
  const o=got.observations[0];
  assert.equal(o.measurements.durationMs.value,1234);
  assert.ok(!JSON.stringify(got).includes("secret@example.com"));
  const missing=await fetch("http://127.0.0.1:"+p+"/impact-manifest",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:o.id,gridIntensityGPerKwh:250,source:{energy:"fixture",grid:"fixture"}})});
  assert.equal(missing.status,422);
  const full=await fetch("http://127.0.0.1:"+p+"/impact-manifest",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:o.id,energyKwh:.001,gridIntensityGPerKwh:250,source:{energy:"fixture",grid:"fixture"}})});
  assert.equal(full.status,200);
  assert.match((await full.json()).manifest,/method: Multiply/);
 }finally{await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
