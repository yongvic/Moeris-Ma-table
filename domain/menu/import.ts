import * as XLSX from "xlsx";

export type MenuImportRow = {
  name: string;
  priceCents: number;
  available: boolean;
  photoUrl: string | null;
};

export type MenuImportResult =
  | { ok: true; rows: MenuImportRow[] }
  | { ok: false; code: string; message: string };

const NAME_KEYS = ["nom", "name", "plat", "libelle", "libellé"];
const PRICE_KEYS = ["prix", "price", "tarif", "fcfa"];
const AVAIL_KEYS = ["disponible", "available", "dispo", "actif"];
const PHOTO_KEYS = ["photo", "photo_url", "photourl", "image", "image_url"];

function normHeader(h: unknown): string {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pickColumn(headers: string[], keys: string[]): number {
  return headers.findIndex((h) => keys.includes(h));
}

function parseAvailable(raw: unknown): boolean {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!s) return true;
  if (["0", "non", "no", "false", "indispo", "indisponible"].includes(s)) {
    return false;
  }
  return true;
}

function parsePrice(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.round(raw);
  }
  const s = String(raw ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

/** Parse .xlsx, .xls ou .csv — colonnes flexibles (nom, prix, disponible, photo). */
export function parseMenuSpreadsheet(buffer: ArrayBuffer): MenuImportResult {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return {
      ok: false,
      code: "PARSE",
      message: "Fichier illisible. Utilise un .xlsx, .xls ou .csv valide.",
    };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return {
      ok: false,
      code: "EMPTY",
      message: "Le fichier ne contient aucune feuille.",
    };
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(
    sheet,
    { header: 1, defval: "" },
  );

  if (matrix.length < 2) {
    return {
      ok: false,
      code: "EMPTY",
      message: "Ajoute au moins une ligne de plat (en-têtes + données).",
    };
  }

  const headers = (matrix[0] ?? []).map(normHeader);
  const nameCol = pickColumn(headers, NAME_KEYS);
  const priceCol = pickColumn(headers, PRICE_KEYS);
  const availCol = pickColumn(headers, AVAIL_KEYS);
  const photoCol = pickColumn(headers, PHOTO_KEYS);

  if (nameCol < 0 || priceCol < 0) {
    return {
      ok: false,
      code: "HEADERS",
      message:
        "Colonnes requises : « nom » et « prix » (ou name / price). Optionnel : disponible, photo.",
    };
  }

  const rows: MenuImportRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < matrix.length; i++) {
    const line = matrix[i] ?? [];
    const name = String(line[nameCol] ?? "").trim();
    if (!name) continue;

    const priceCents = parsePrice(line[priceCol]);
    if (priceCents === null) {
      errors.push(`Ligne ${i + 1} (« ${name} ») : prix invalide.`);
      continue;
    }

    const available =
      availCol >= 0 ? parseAvailable(line[availCol]) : true;
    const photoRaw =
      photoCol >= 0 ? String(line[photoCol] ?? "").trim() : "";
    const photoUrl = photoRaw || null;

    rows.push({ name, priceCents, available, photoUrl });
  }

  if (rows.length === 0) {
    return {
      ok: false,
      code: "NO_ROWS",
      message:
        errors[0] ??
        "Aucune ligne valide trouvée. Vérifie les en-têtes et les prix.",
    };
  }

  if (errors.length > 0 && rows.length === 0) {
    return { ok: false, code: "VALIDATION", message: errors.join(" ") };
  }

  return { ok: true, rows };
}
