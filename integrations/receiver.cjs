"use strict";
const http=require("node:http");
const {fromOtlpTraces}=require("./otlp-bridge.cjs");
const {toImpactManifest}=require("./impact-framework.cjs");
const port=Number(process.env.SAP_BRIDGE_PORT||4319);
if(!Number.isInteger(port)||port<1||port>65535)throw Error("Invalid port");
const recent=new Map();
function send(res,status,obj){res.writeHead(status,{"Content-Type":"application/json","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(JSON.stringify(obj));}
async function readJson(req){
 const size=Number(req.headers["content-length"]);if(Number.isFinite(size)&&size>262144)throw Error("Request too large");
 let n=0,text="";for await(const b of req){n+=b.length;if(n>262144)throw Error("Request too large");text+=b.toString("utf8");}
 return JSON.parse(text);
}
const server=http.createServer(async(req,res)=>{
 try{
  if(req.method==="GET"&&req.url==="/health")return send(res,200,{ok:true,transport:"loopback",stored:recent.size});
  if(req.method==="POST"&&req.url==="/v1/traces"){
   if(!/application\/json/i.test(req.headers["content-type"]||""))return send(res,415,{error:"OTLP JSON only"});
   const observations=fromOtlpTraces(await readJson(req));
   for(const o of observations){recent.set(o.id,o);if(recent.size>150)recent.delete(recent.keys().next().value);}
   return send(res,200,{partialSuccess:{}});
  }
  if(req.method==="GET"&&req.url==="/observations")return send(res,200,{schema:"sap.observations.v0.3-draft",observations:[...recent.values()]});
  if(req.method==="POST"&&req.url==="/impact-manifest"){
   if(!/application\/json/i.test(req.headers["content-type"]||""))return send(res,415,{error:"JSON only"});
   const data=await readJson(req),o=recent.get(data.id);
   if(!o)return send(res,404,{error:"Unknown observation"});
   if(data.energyKwh===undefined||data.energyKwh===null)return send(res,422,{error:"Energy missing; cannot calculate emissions"});
   return send(res,200,toImpactManifest({energyKwh:data.energyKwh,gridIntensityGPerKwh:data.gridIntensityGPerKwh,embodiedGco2e:data.embodiedGco2e,source:data.source,timestamp:o.observedAt,durationS:Math.max(o.measurements.durationMs.value/1000,.001)}));
  }
  return send(res,404,{error:"Not found"});
 }catch(e){if(!res.headersSent)send(res,400,{error:String(e.message).slice(0,200)});}
});
if(require.main===module)server.listen(port,"127.0.0.1",()=>console.log("SAP receiver: http://127.0.0.1:"+port));
module.exports={server};
