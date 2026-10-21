"use strict";
/* Independent-from-producer SAP decision consumer. Does not execute an AI task. */
const fs=require("node:fs"),crypto=require("node:crypto");
const SAP=require("../sap-core.js");
const {assertEnvelope,validateExchange}=require("../protocol/validate.cjs");

function choose(offers,settings={}){
 const opts={mode:settings.mode||"performance",minQuality:settings.minQuality??0.5,localOnly:!!settings.localOnly,humanReviewRequired:!!settings.humanReviewRequired};
 if(!Array.isArray(offers)||offers.length===0)throw Error("At least one offer required");
 offers.forEach(x=>{assertEnvelope(x);if(x.kind!=="sap.offer")throw Error("Expected offer");});
 const first=offers[0];
 for(const x of offers)if(x.exchange_id!==first.exchange_id||JSON.stringify(x.operation)!==JSON.stringify(first.operation))throw Error("Exchange mismatch");
 const usable=offers.filter(x=>x.payload.metrics.quality_proxy.value!==null);
 const candidates=usable.map(x=>{
  const p=x.payload,m=p.metrics,local=(p.locality==="on_device"||p.locality==="on_prem");
  return {id:x.id,label:p.option_id,location:local?"local":p.locality,
    quality:m.quality_proxy.value,costUSD:m.cost_usd.value,latencyMs:m.latency_ms.value,
    energyKwh:m.energy_kwh.value,energyEvidence:m.energy_kwh.basis,
    energyNote:m.energy_kwh.scope,humanReview:p.human_review_available};
 });
 const result=candidates.length?SAP.evaluate(candidates,{
   mode:opts.mode,localOnly:opts.localOnly,minimumQuality:opts.minQuality,humanReview:opts.humanReviewRequired
 }):{selected:null,reason:"No quality evidence",provisional:true};
 const selected=result.selected?offers.find(x=>x.id===result.selected.id):null;
 const decision={
  sap_version:first.sap_version,kind:"sap.decision",id:"decision-"+crypto.randomUUID(),
  exchange_id:first.exchange_id,created_at:new Date().toISOString(),operation:first.operation,
  payload:{
   selected_offer_id:selected?selected.id:null,
   policy:{mode:opts.mode,min_quality:opts.minQuality,local_only:opts.localOnly,human_review_required:opts.humanReviewRequired},
   reason_code:selected?"selected":result.reason==="No quality evidence"?"insufficient_evidence":"no_eligible_offer",
   provisional:!selected||!!result.provisional||selected.payload.metrics.quality_proxy.basis!=="measured"
  }
 };
 assertEnvelope(decision);validateExchange([...offers,decision]);
 return decision;
}
if(require.main===module){
 try{
  const args=process.argv.slice(2);
  const paths=args.filter(x=>!x.startsWith("--"));
  if(!paths.length)throw Error("Usage: node examples/sap-consumer.cjs [--local-only] [--mode=performance] offer1.json ...");
  const modeArg=args.find(x=>x.startsWith("--mode="));
  const documents=paths.map(p=>JSON.parse(fs.readFileSync(p,"utf8")));
  const result=choose(documents,{localOnly:args.includes("--local-only"),mode:modeArg?modeArg.split("=")[1]:"performance"});
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
 }catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={choose};
