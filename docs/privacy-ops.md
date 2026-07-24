# Privacy ops — contacts Guest (V1)

Process staff / ops — **pas** d’UI self-service d’effacement en V1.

## Finalité

Contacts opt-in (téléphone XOR email) : soirées Moeris / relation Résidence. Accès **staff-only** (Neon). Miroir Google Sheet best-effort si configuré (`GOOGLE_SHEETS_ID`) — Neon reste la source de vérité.

## Rétention

- Conserver les contacts Guest **au plus 24 mois** après `lastInteractionAt`, sauf obligation légale contraire.
- Revue trimestrielle recommandée : lister les Guest inactifs > 24 mois et les supprimer en Neon (+ ligne Sheet si miroir actif).

## Effacement sur demande

Délai cible : **≤ 15 jours** après demande écrite du client.

1. Identifier le Guest (tél E.164 ou email lower) en Neon.
2. Supprimer (ou anonymiser) : `Preference`, lien `Session.guestId`, puis `Guest`.
3. Si Sheet miroir : retirer la ligne correspondante.
4. Soft cookie device (`mt_device`) : expire naturellement ; pas d’action serveur obligatoire.

## Pas en V1

- Portail d’effacement client
- Export RGPD automatisé
- Tracking table / heure / compagnie
