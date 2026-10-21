"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {fromOtlpTraces}=require("./otlp-bridge.cjs");
const {toReceipt}=require("./to-sap-envelope.cjs");
const {assertEnvelope,validateExchange}=require("../protocol/validate.cjs");
const offer=JSON.parse(fs.readFileSync(path.join(__dirname,"../protocol/conformance/valid/offer-local.json"),"utf8"));
function input(){
 return {resourceSpans:[{resource:{attributes:[]},scopeSpans:[{spans:[{
  traceId:"1234567890abcdef1234567890abcdef",spanId:"1234567890abcdef",
  startTimeUnixNano:"1792580000000000000",endTimeUnixNano:"1792580001000000000",
  attributes:[
   {key:"gen_ai.operation.name",value:{stringValue:"chat"}},
   {key:"gen_ai.request.model",value:{stringValue:"local-pilot"}},
   {key:"gen_ai.input.messages",value:{stringValue:"never record private prompt"}}
  ]
 }]}]}]};
}
test("actual OTel → SAP receipt respects schema and confidentiality",()=>{
 const o=fromOtlpTraces(input())[0];
 const receipt=toReceipt(o,offer);
 assertEnvelope(receipt);
 assert.equal(receipt.payload.status,"reported");
 assert.equal(receipt.payload.metrics.latency_ms.value,1000);
 assert.equal(receipt.payload.metrics.energy_kwh.value,null);
 assert.equal(receipt.payload.metrics.carbon_gco2e.value,null);
 assert.equal(receipt.payload.verification,null);
 assert.ok(!JSON.stringify(receipt).includes("never record private prompt"));
 assert.equal(validateExchange([offer,receipt]).ok,true);
});
test("telemetry cannot certify independent task verification",()=>{
 const o=fromOtlpTraces(input())[0];
 assert.throws(()=>toReceipt(o,offer,{status:"verified"}),/cannot prove/);
});
test("schema boundary rejects metadata missing actual observed duration",()=>{
 const o=fromOtlpTraces(input())[0];
 o.measurements.durationMs.value=null;
 assert.throws(()=>toReceipt(o,offer),/latency/);
});
