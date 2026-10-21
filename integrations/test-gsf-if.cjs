"use strict";
/* CI-only interoperability test: runs actual GSF 'if-run' using FICTIONAL inputs. */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const {toImpactManifest}=require("./impact-framework.cjs");
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"sap-if-"));
try{
 const r=toImpactManifest({energyKwh:.002,gridIntensityGPerKwh:300,embodiedGco2e:.2,timestamp:"2026-10-21T09:00:00Z",durationS:1,source:{energy:"CI-FICTIONAL",grid:"CI-FICTIONAL",embodied:"CI-FICTIONAL"}});
 const f=path.join(tmp,"manifest.yml");fs.writeFileSync(f,r.manifest);
 const p=cp.spawnSync("if-run",["--manifest",f],{encoding:"utf8",timeout:120000,maxBuffer:1024*1024,cwd:tmp});
 if(p.error)throw p.error;
 if(p.status!==0)throw Error("IF CLI failure: "+(p.stderr||p.stdout).slice(0,4000));
 const out=p.stdout;
 if(!/sci:\s*0\.8\b/.test(out)||!/carbon-operational:\s*0\.6\b/.test(out))
  throw Error("IF did not return expected synthetic SCI 0.8 and operational carbon 0.6. Output: "+out.slice(0,3000));
 console.log("PASS actual GSF Impact Framework processed SAP manifest (fictional SCI 0.8 gCO2eq/request)");
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
