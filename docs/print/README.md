# Kit print — génération des QR Carte table

## Prérequis

```bash
npm install
```

Dev dependency : `qrcode` (génération SVG uniquement — pas utilisée au runtime Next).

## Variables

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `BASE_URL` | Origine publique Ma table | `https://ma-table.example.com` |
| `WIFI_SSID` | SSID placeholder | `Moeris-Guest` |
| `WIFI_PASSWORD` | Mot de passe placeholder | `change-me` |
| `WIFI_TYPE` | `WPA` / `WEP` / vide | `WPA` |
| `TABLE_IDS` | Liste séparée par virgules | `t-1,t-2,t-3,t-4,t-5` |

**Ne jamais** committer les vrais secrets Wi‑Fi prod. Utiliser des placeholders dans Git ; injecter les vraies valeurs uniquement en atelier.

## Régénérer les exemples

```bash
npm run print:qr
```

Écrit dans `public/print/examples/` :

- `wifi-placeholder.svg`
- `t-<id>-ma-table.svg` pour chaque table

Puis ouvrir le preview :

```text
docs/print/layout-carte-table.html
```

(Chrome → Imprimer / PDF pour validation contraste.)

## Payload Wi‑Fi

```text
WIFI:S:<SSID>;T:<TYPE>;P:<PASSWORD>;;
```

## Payload Ma table

```text
<BASE_URL>/t/<tableId>
```

Aligné story 1.2 — **pas** de QR combiné Wi‑Fi+URL.
