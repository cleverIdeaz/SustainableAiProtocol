"use strict";
/* App A — real OTel SDK telemetry from a local Ollama inference; no user prompt logs */
const {BasicTracerProvider,SimpleSpanProcessor}=require("@opentelemetry/sdk-trace-base");
const {OTLPTraceExporter}=require("@opentelemetry/exporter-trace-otlp-http");
const model=process.env.SAP_OLLAMA_MODEL;
const port=Number(process.env.SAP_BRIDGE_PORT||4319);
if(!model){console.error("Set SAP_OLLAMA_MODEL to a locally installed model.");process.exit(2);}
const provider=new BasicTracerProvider({spanProcessors:[
 new SimpleSpanProcessor(new OTLPTraceExporter({url:"http://127.0.0.1:"+port+"/v1/traces"}))
]});
const tracer=provider.getTracer("sap-otel-local-inference","0.3");
async function main(){
 const span=tracer.startSpan("chat "+model,{attributes:{"gen_ai.operation.name":"chat","gen_ai.provider.name":"ollama","gen_ai.request.model":model}});
 try{
  const r=await fetch("http://127.0.0.1:11434/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model,prompt:"Reply with only the word ready.",stream:false}),signal:AbortSignal.timeout(90000)});
  if(!r.ok)throw Error("Ollama HTTP "+r.status);
  const data=await r.json();
  if(Number.isSafeInteger(data.prompt_eval_count)&&data.prompt_eval_count>=0)span.setAttribute("gen_ai.usage.input_tokens",data.prompt_eval_count);
  if(Number.isSafeInteger(data.eval_count)&&data.eval_count>=0)span.setAttribute("gen_ai.usage.output_tokens",data.eval_count);
  span.setAttribute("sap.outcome","success");console.log("Local inference completed; no prompt/response text exported.");
 }catch(e){span.setAttribute("sap.outcome","error");console.error(e.message);process.exitCode=1;}
 finally{span.end();await provider.forceFlush();await provider.shutdown();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
