"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {BasicTracerProvider,SimpleSpanProcessor}=require("@opentelemetry/sdk-trace-base");
const {OTLPTraceExporter}=require("@opentelemetry/exporter-trace-otlp-http");
const {server}=require("./receiver.cjs");
test("actual OpenTelemetry SDK sends an instrumented span to SAP",async()=>{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const port=server.address().port;
 const provider=new BasicTracerProvider({spanProcessors:[
  new SimpleSpanProcessor(new OTLPTraceExporter({url:"http://127.0.0.1:"+port+"/v1/traces"}))
 ]});
 try{
  const span=provider.getTracer("sap-interop-test").startSpan("chat model",{attributes:{
   "gen_ai.operation.name":"chat","gen_ai.request.model":"sdk-test","gen_ai.provider.name":"ollama",
   "gen_ai.usage.input_tokens":4,"gen_ai.usage.output_tokens":2,
   "gen_ai.input.messages":"NEVER COPY THIS"
  }});
  await new Promise(r=>setTimeout(r,8));span.end();await provider.forceFlush();
  const response=await fetch("http://127.0.0.1:"+port+"/observations");
  const items=(await response.json()).observations;
  assert.equal(items.length,1);
  assert.equal(items[0].model,"sdk-test");
  assert.equal(items[0].measurements.inputTokens.value,4);
  assert.ok(items[0].measurements.durationMs.value>=0);
  assert.ok(!JSON.stringify(items).includes("NEVER COPY THIS"));
 }finally{await provider.shutdown();await new Promise(resolve=>server.close(resolve));}
});
