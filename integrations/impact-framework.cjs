"use strict";
/**
 * Generate a real Green Software Foundation Impact Framework (IF) manifest.
 * No per-token energy guess; missing whole-workload energy prevents calculation.
 */
function finite(n,positive=false) { return typeof n === "number" && Number.isFinite(n) && (positive ? n > 0 : n >= 0); }
function toImpactManifest({energyKwh,gridIntensityGPerKwh,embodiedGco2e=null,timestamp,durationS,source}) {
 if (!finite(energyKwh) || !finite(gridIntensityGPerKwh)) throw Error("Energy and regional grid intensity are required");
 if (!source || typeof source.energy !== "string" || !source.energy.trim() ||
     typeof source.grid !== "string" || !source.grid.trim()) throw Error("Energy and grid provenance required");
 if (!finite(durationS,true) || typeof timestamp !== "string" || !Number.isFinite(Date.parse(timestamp))) throw Error("Timestamp/duration required");
 if (embodiedGco2e !== null && !finite(embodiedGco2e)) throw Error("Invalid embodied emissions");
 if (embodiedGco2e !== null && (!source.embodied || typeof source.embodied !== "string")) throw Error("Embodied provenance required");
 const when=new Date(timestamp).toISOString();
 // A stable YAML manifest using numeric inputs only; no arbitrary source text interpolated.
 const l=[
 "name: sap-impact-interop",
 "description: GSF Impact Framework calculation of independently supplied observations",
 "tags:",
 "initialize:",
 "  plugins:",
 "    operational-carbon:",
 "      path: builtin",
 "      method: Multiply",
 "      config:",
 "        input-parameters:",
 "          - energy",
 "          - grid/carbon-intensity",
 "        output-parameter: carbon-operational"
 ];
 if(embodiedGco2e !== null) l.push(
 "    sum-carbon:","      path: builtin","      method: Sum","      config:",
 "        input-parameters:","          - carbon-operational","          - embodied-carbon",
 "        output-parameter: carbon",
 "    sci:","      path: builtin","      method: Sci","      config:","        functional-unit: requests"
 );
 l.push(
 "tree:","  children:","    sap-execution:",
 "      pipeline:","        observe:","        regroup:","        compute:",
 "          - operational-carbon"
 );
 if(embodiedGco2e!==null) l.push("          - sum-carbon","          - sci");
 l.push(
 "      inputs:",
 "        - timestamp: '" + when + "'",
 "          duration: " + durationS,
 "          energy: " + energyKwh,
 "          grid/carbon-intensity: " + gridIntensityGPerKwh
 );
 if(embodiedGco2e!==null) l.push("          embodied-carbon: " + embodiedGco2e,"          requests: 1");
 return {
  manifest:l.join("\n")+"\n",
  claim:embodiedGco2e===null?"operational-carbon-only":"SCI-per-request-with-user-supplied-embodied",
  sources:{energy:source.energy,grid:source.grid,embodied:source.embodied || null},
  warning:"SAP does not verify the accuracy or measurement boundary of supplied meter, grid or lifecycle data."
 };
}
module.exports = {toImpactManifest};
