/**
 * Génère les SVG QR d'exemple pour la Carte table (story 1.6).
 * Usage: npm run print:qr
 *
 * Secrets prod : NE PAS committer — utiliser WIFI_* placeholders uniquement en repo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "public", "print", "examples");

const BASE_URL = (process.env.BASE_URL || "https://ma-table.example.com").replace(
  /\/$/,
  "",
);
const WIFI_SSID = process.env.WIFI_SSID || "Moeris-Guest";
const WIFI_PASSWORD = process.env.WIFI_PASSWORD || "change-me";
const WIFI_TYPE = process.env.WIFI_TYPE ?? "WPA";
const TABLE_IDS = (process.env.TABLE_IDS || "t-1,t-2,t-3,t-4,t-5")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function escapeWifiField(value) {
  return String(value).replace(/([\\;,:"])/g, "\\$1");
}

function wifiPayload(ssid, password, type) {
  const t = type ? `T:${type};` : "T:;";
  return `WIFI:S:${escapeWifiField(ssid)};${t}P:${escapeWifiField(password)};;`;
}

const qrOpts = {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#000000", light: "#FFFFFF" },
};

async function writeQr(fileName, text) {
  const svg = await QRCode.toString(text, qrOpts);
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, svg, "utf8");
  console.log("wrote", path.relative(root, filePath), "←", text.slice(0, 64));
}

fs.mkdirSync(outDir, { recursive: true });

await writeQr(
  "wifi-placeholder.svg",
  wifiPayload(WIFI_SSID, WIFI_PASSWORD, WIFI_TYPE),
);

for (const id of TABLE_IDS) {
  await writeQr(`${id}-ma-table.svg`, `${BASE_URL}/t/${id}`);
}

console.log("\nDone. Preview: docs/print/layout-carte-table.html");
console.log("Remember: WIFI_* values above are placeholders — not production secrets.");
