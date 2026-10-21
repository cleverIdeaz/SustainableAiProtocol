const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");

test("new homepage clearly explains people, planet and prosperity", () => {
 const s = read("index.html");
 for(const word of ["People", "Planet", "Prosperity", "MCP", "Open Source Frontier", "Phewsh", "Sustainable AI Protocol"])
   assert.ok(s.includes(word), "Missing essential concept: " + word);
 assert.match(s, /Helping intelligence grow without exhausting what sustains it/i);
});
test("site has developer adoption path and preserves the lab", () => {
 const s = read("index.html");
 for(const path of ["./lab.html", "./integrate.html", "./sap-mark.svg", "./docs/legacy-telemetry.html"])
   assert.ok(s.includes(path), "Missing site path: " + path);
 for(const file of ["lab.html", "integrate.html", "sap-mark.svg", "docs/legacy-telemetry.html"])
   assert.ok(fs.existsSync(path.join(__dirname, file)), "Missing target: " + file);
});
test("homepage identifies what is and isn't implemented", () => {
 const s = read("index.html");
 assert.match(s, /fictional/i);
 assert.match(s, /not a ratified standard/i);
 assert.match(s, /not a required stack/i);
 assert.match(s, /reduced-motion/);
});
test("archive has explicit historical disclaimer", () => {
 const s = read("docs/legacy-telemetry.html");
 assert.match(s,/ARCHIVED PROTOTYPE DOCUMENTATION/);
 assert.match(s,/not been independently validated/);
});
test("developer quick start references real API and makes no remote claims", () => {
 const s = read("integrate.html"), core=read("sap-core.js");
 assert.match(s, /SAP.evaluate/);
 assert.match(core,/evaluate/);
 assert.match(s, /No remote call has been made/);
 assert.match(s, /energyEvidence/);
});
test("SVG emblem is accessible and valid-looking", () => {
 const s = read("sap-mark.svg");
 assert.match(s,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);
 assert.match(s,/<title/);
 assert.match(s,/<desc/);
});
