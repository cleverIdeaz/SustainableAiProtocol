"use strict";
/* SAP draft envelope validator. No network, persistence, or inference. */
const fs=require("node:fs"),path=require("node:path");
const Ajv2020=require("ajv/dist/2020");
const addFormats=require("ajv-formats");
const SCHEMA=path.join(__dirname,"schema","envelope-2026-10-21.schema.json");
const schema=JSON.parse(fs.readFileSync(SCHEMA,"utf8"));
const ajv=new Ajv2020({allErrors:true,strict:false,validateFormats:true});
addFormats(ajv);
const validate=ajv.compile(schema);
function assertEnvelope(data){
 const json=JSON.stringify(data);
 if(json && Buffer.byteLength(json,"utf8")>65536) throw Error("Envelope exceeds 64 KiB");
 if(!validate(data))throw Error("SAP_INVALID_ENVELOPE: "+ajv.errorsText(validate.errors,{separator:"; "}));
 return data;
}
function validateExchange(items){
 if(!Array.isArray(items)||items.length<2||items.length>100)throw Error("Exchange must contain 2–100 documents");
 for(const x of items)assertEnvelope(x);
 const ids=new Set();
 for(const x of items){if(ids.has(x.id))throw Error("Duplicate document ID");ids.add(x.id);}
 const exchange=items[0].exchange_id,task=JSON.stringify(items[0].operation);
 for(const x of items)if(x.exchange_id!==exchange||JSON.stringify(x.operation)!==task)throw Error("Exchange/task mismatch");
 const offers=new Map(items.filter(x=>x.kind==="sap.offer").map(x=>[x.id,x.payload]));
 if(offers.size!==items.filter(x=>x.kind==="sap.offer").length)throw Error("Duplicate offer IDs");
 for(const x of items){
  if(x.kind==="sap.decision"){
   const p=x.payload;
   const ofr=offers.get(p.selected_offer_id);
   if(p.selected_offer_id!==null){
    if(!ofr)throw Error("Decision references unknown offer");
    if(p.policy.local_only && ofr.locality!=="on_device" && ofr.locality!=="on_prem")throw Error("Local-only policy violated");
    if(p.policy.human_review_required && !ofr.human_review_available)throw Error("Required human review unavailable");
    const quality=ofr.metrics.quality_proxy.value;
    if(quality===null || quality<p.policy.min_quality)throw Error("Selected offer below/without quality threshold");
    if(p.reason_code==="no_eligible_offer"||p.reason_code==="insufficient_evidence")throw Error("Decision outcome conflicts with selection");
   }else if(p.reason_code==="selected"||p.reason_code==="user_choice")throw Error("Selection missing");
  }
  if(x.kind==="sap.receipt" && !offers.has(x.payload.offer_id))throw Error("Receipt references unknown offer");
 }
 return {exchange_id:exchange,offers:offers.size,documents:items.length,ok:true};
}
function main(args){
 if(args[0]==="--fixtures"){
  const root=path.join(__dirname,"conformance");
  for(const dir of ["valid","invalid"]){
   for(const file of fs.readdirSync(path.join(root,dir)).filter(x=>x.endsWith(".json")).sort()){
    const p=path.join(root,dir,file),data=JSON.parse(fs.readFileSync(p,"utf8"));
    let ok;try{assertEnvelope(data);ok=true;}catch(_){ok=false;}
    if(ok!==(dir==="valid"))throw Error("Vector disagreement: "+dir+"/"+file);
    console.log((ok?"VALID":"REJECTED")+" "+dir+"/"+file);
   }
  }
  const docs=["offer-local","offer-cloud","decision","receipt-reported"].map(n=>JSON.parse(fs.readFileSync(path.join(root,"valid",n+".json"),"utf8")));
  console.log("Exchange check:",validateExchange(docs));
  const bad=JSON.parse(JSON.stringify(docs));
  bad[2].payload.selected_offer_id="offer-remote-1";
  try{validateExchange(bad);throw Error("Must reject local-only bypass");}catch(e){if(!/Local-only policy violated/.test(e.message))throw e;}
  return;
 }
 if(args.length!==1){console.error("Usage: node protocol/validate.cjs <document.json> | --fixtures");process.exitCode=2;return;}
 const doc=JSON.parse(fs.readFileSync(args[0],"utf8"));
 assertEnvelope(doc);console.log("SAP envelope valid ("+doc.sap_version+" "+doc.kind+")");
}
if(require.main===module){try{main(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={assertEnvelope,validateExchange};
