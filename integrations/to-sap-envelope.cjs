"use strict";
/* Converts actual OpenTelemetry metadata observations into SAP draft receipts.
 * This adapter does NOT invent a measured environmental metric or verifier.
 * A referenced offer must exist in the same exchange for flow conformance.
 */
const {assertEnvelope}=require("../protocol/validate.cjs");
const unknown=unit=>({value:null,unit,basis:"unknown",source:null,scope:"not observed"});
function toReceipt(observation,offer,{status="reported"}={}){
 if(!observation||typeof observation!=="object")throw Error("Observation required");
 assertEnvelope(offer);
 if(offer.kind!=="sap.offer")throw Error("Provide SAP offer");
 if(!["reported","failed","unknown","attempted"].includes(status))throw Error("Telemetry cannot prove independently verified outcomes");
 const duration=observation.measurements?.durationMs;
 if(!duration||typeof duration.value!=="number"||!Number.isFinite(duration.value)||duration.value<0)throw Error("Valid observed latency required");
 const energy=unknown("kWh"),carbon=unknown("gCO2e");
 const cost=unknown("USD"),quality=unknown("ratio");
 const latency={
  value:duration.value,unit:"ms",basis:"measured",
  source:"otel:"+String(observation.id).slice(0,170),
  scope:"instrumented client wall-clock; excludes unknown external side effects"
 };
 const out={
  sap_version:offer.sap_version,kind:"sap.receipt",
  id:"receipt-"+offer.id+"-"+String(observation.id).replace(/[^a-zA-Z0-9._:-]/g,"").slice(0,46),
  exchange_id:offer.exchange_id,
  created_at:new Date().toISOString(),
  operation:offer.operation,
  payload:{
   offer_id:offer.id,
   status,
   metrics:{energy_kwh:energy,carbon_gco2e:carbon,cost_usd:cost,latency_ms:latency,quality_proxy:quality},
   verification:null
  }
 };
 return assertEnvelope(out);
}
module.exports={toReceipt};
