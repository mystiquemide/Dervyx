import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { sampleAnomaly, sampleClean } from "../dist/lib/sample.js";
import { buildEvidenceReceipt } from "../dist/src/receipt.js";

const outputDir = resolve("examples");
mkdirSync(outputDir, { recursive: true });

const fixtures = [
  { name: "anomaly", certificate: sampleAnomaly },
  { name: "control", certificate: sampleClean },
];

for (const fixture of fixtures) {
  const certificatePath = resolve(outputDir, `${fixture.name}-certificate.json`);
  const receiptPath = resolve(outputDir, `${fixture.name}-receipt.json`);
  const certificate = fixture.certificate;
  const receipt = buildEvidenceReceipt(certificate);
  writeFileSync(certificatePath, `${JSON.stringify(certificate, null, 2)}\n`, "utf8");
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  console.log(`${fixture.name}: ${certificate.reportHash}`);
}
