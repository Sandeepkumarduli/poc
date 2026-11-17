// Generates public/sample-report-card.pdf with no dependencies.
// Run: node scripts/make-sample-pdf.mjs
import { writeFileSync } from "node:fs";

const W = 595, H = 842; // A4 in points
const ops = [];
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const text = (x, y, s, size = 11, bold = false, rgb = [0.12, 0.11, 0.09]) =>
  ops.push(`${rgb.join(" ")} rg BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${H - y} Td (${esc(s)}) Tj ET`);
const rect = (x, y, w, h, rgb) => ops.push(`${rgb.join(" ")} rg ${x} ${H - y - h} ${w} ${h} re f`);
const line = (x1, y, x2) => ops.push(`0.88 0.86 0.84 RG 0.8 w ${x1} ${H - y} m ${x2} ${H - y} l S`);

// Header band
rect(0, 0, W, 96, [0.16, 0.14, 0.12]);
rect(40, 30, 36, 36, [0.91, 0.39, 0.23]);
text(52, 54, "+", 22, true, [1, 1, 1]);
text(90, 46, "Greenfield Public School", 18, true, [1, 1, 1]);
text(90, 66, "Pune  |  Session 2026-27  |  StudentKitPro", 10, false, [0.8, 0.78, 0.75]);
text(420, 46, "PROGRESS REPORT", 11, true, [0.91, 0.39, 0.23]);
text(420, 64, "Term 1", 10, false, [0.8, 0.78, 0.75]);

// Student info
const info = [
  ["Student", "Aarav Sharma"], ["Class", "8-A  |  Roll 12"],
  ["Parent", "Vikram Sharma"], ["Class teacher", "Mrs. Meera Rao"],
];
info.forEach(([k, v], i) => {
  const x = 40 + (i % 2) * 260, y = 130 + Math.floor(i / 2) * 40;
  text(x, y, k, 9, false, [0.56, 0.53, 0.5]);
  text(x, y + 15, v, 12, true);
});

// Marks table
let y = 230;
rect(40, y - 16, W - 80, 26, [0.96, 0.95, 0.94]);
text(52, y, "Subject", 10, true); text(250, y, "Unit Test 1 (50)", 10, true); text(380, y, "Mid Term (100)", 10, true); text(500, y, "Grade", 10, true);
const rows = [["Maths", 36, 77, "B1"], ["Science", 45, 93, "A1"], ["English", 43, 86, "A2"], ["Hindi", 40, 82, "A2"], ["Social", 40, 89, "A2"], ["Computer", 47, 96, "A1"]];
rows.forEach((r) => {
  y += 30;
  text(52, y, r[0], 11); text(250, y, String(r[1]), 11); text(380, y, String(r[2]), 11); text(500, y, r[3], 11, true);
  line(40, y + 10, W - 40);
});
y += 34;
text(52, y, "Overall", 12, true); text(250, y, "83.7%", 12, true); text(380, y, "87.2%", 12, true); text(500, y, "A2", 12, true);

// Attendance + remark
y += 50;
rect(40, y, 160, 70, [0.96, 0.95, 0.94]);
text(54, y + 22, "Attendance", 9, false, [0.56, 0.53, 0.5]);
text(54, y + 46, "93.3%", 20, true);
text(54, y + 62, "28 of 30 days", 9, false, [0.56, 0.53, 0.5]);
rect(215, y, W - 255, 70, [0.96, 0.95, 0.94]);
text(229, y + 22, "Class teacher's remark", 9, false, [0.56, 0.53, 0.5]);
text(229, y + 42, "Aarav is doing well. More regular practice in Maths", 10.5);
text(229, y + 57, "will lift the overall result.", 10.5);

// Signatures
y += 150;
line(40, y, 200); line(W - 200, y, W - 40);
text(40, y + 16, "Class teacher", 9, false, [0.56, 0.53, 0.5]);
text(W - 200, y + 16, "Principal  |  Mr. Rajesh Kumar", 9, false, [0.56, 0.53, 0.5]);
text(40, H - 30, "Sample document generated for the StudentKitPro demo. Not an official record.", 8, false, [0.56, 0.53, 0.5]);

const content = ops.join("\n");
const objs = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
  `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
];
let pdf = "%PDF-1.4\n";
const offsets = [];
objs.forEach((o, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("")}`;
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
writeFileSync(new URL("../public/sample-report-card.pdf", import.meta.url), pdf);
console.log("Wrote public/sample-report-card.pdf", Buffer.byteLength(pdf), "bytes");
