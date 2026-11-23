import { writeFileSync } from "node:fs";
const bps = ["initial", "sm", "md", "lg", "xl", "2xl"];
const props = {
  gap: { values: ["0","1","2","3","4","5","6","8","10","12","16"], cls: v => `gap-${v}` },
  direction: { values: ["row","column","row-reverse","column-reverse"], cls: v => ({row:"flex-row",column:"flex-col","row-reverse":"flex-row-reverse","column-reverse":"flex-col-reverse"})[v] },
  align: { values: ["start","center","end","stretch","baseline"], cls: v => `items-${v}` },
  justify: { values: ["start","center","end","between","around","evenly"], cls: v => `justify-${v}` },
  wrap: { values: ["wrap","nowrap"], cls: v => v === "wrap" ? "flex-wrap" : "flex-nowrap" },
  textSize: { values: ["xs","sm","base","lg","xl","2xl","3xl","4xl"], cls: v => `text-${v}` },
};
const out = {};
let n = 0;
for (const [p, { values, cls }] of Object.entries(props)) {
  out[p] = {};
  for (const bp of bps) {
    out[p][bp] = {};
    for (const v of values) { out[p][bp][v] = bp === "initial" ? cls(v) : `${bp}:${cls(v)}`; n++; }
  }
}
writeFileSync("src/classes.ts", `// generato da gen.mjs: ${n} classi\nexport const classes = ${JSON.stringify(out, null, 1)} as const;\n`);
console.log(`classi generate: ${n}`);
