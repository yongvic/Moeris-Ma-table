# Reconcile — Brainstorm intent ↔ PRD draft

**Date:** 2026-07-23  
**Input:** `brainstorm-intent.md` + décisions `.memlog.md` (brainstorm)  
**Against:** `prd.md` (draft) + décisions `.memlog.md` (PRD)  
**Verdict:** **needs fixes** (qualitatif chaleur / message chef selon avis ; quelques micro-règles UX affaiblies)

---

## 1. Preserved decisions (ok)

Décisions brainstorm figées reprises correctement dans le PRD (vision, glossaire, FR, non-goals, MVP).

| Décision brainstorm | Où dans le PRD |
|---------------------|----------------|
| Produit « Ma table » / Résidence Moeris ; fil séjour menu → commande → fin | §1 Vision ; Glossaire |
| Carte 2 QR côte à côte (Wi‑Fi natif + Ma table) ; pas combo unique | FR-1, FR-2 ; §12 ; Non-goals |
| Wi‑Fi auto, pas captive portal | FR-1 ; Glossaire QR Wi‑Fi ; Non-goals |
| Label 2e QR = « Ma table » | Glossaire ; UJ-1 ; FR-2 |
| Un scan ouvre le fil ; pas de rescans en cours de séjour | FR-3–FR-5 ; Vision |
| Session persistée (local + ID serveur) ; refresh/crash → reprise ; TTL ~6 h | FR-3 ; Glossaire Session |
| Onglet fermé → rescanner Ma table = reprise (table/appareil) | FR-4 ; UJ-1 edge |
| Micro-missions but précis (~10–30 s) ; pas de feed | FR-5 ; SM-C1/C2 ; Non-goals |
| Client anonyme au scan → identifié en fin (opt-in) | Glossaire ; UJ-1 ; FR-14 |
| Mémoire V1 seulement (pas avantages / accès rapide) | FR-16–FR-19 ; Non-goals ; §2.2 |
| Préférés top 3–5 (notes + tags soft) | FR-18 ; Glossaire |
| Goûts cuisine mémorisés ; 1 tap à la 2e visite | FR-9, FR-19 |
| Pas tracking table/heure/compagnie ; allergies hors priorité V1 | FR-18 ; Non-goals ; §11 |
| Déclencheur « Terminer mon expérience » **après** réception commande | FR-12 ; Glossaire |
| Succès idéal = avis + contact (sans surcharge) | Vision ; FR-13–14 ; SM-1/SM-2 |
| Avis court note/emoji ; pas mur de texte | FR-13 ; Non-goals |
| Contact opt-in « soirées Moeris » ; anti-spam | FR-14 ; §11 |
| Clôture chef chaleureux ; chaleur via ambiance + ton chef | FR-15 ; §8 Aesthetic |
| Animation chef V1 légère (2D) ; 3D différé | FR-15 assumption ; §6.2 |
| Google soft post-merci = aspiration, pas cœur V1 | Non-goals ; §6.2 |
| Non-goals UX : compte/mdp, pop-ups, pubs, feed, captive, combo QR, dashboard client, avantages V1 | §5 ; §8 |
| Contrainte print : contraste, numéros grands, durable, un objet mental | §12 |
| Persona peu à l’aise digital (gros boutons, photos, zéro jargon) | UJ-1 Mame Fatou ; §10 a11y |
| Dial « bienvenue à la maison » (partiel) | §8 (mention) ; Vision émotionnelle |

---

## 2. Intentional divergences (déjà tranchées dans le memlog PRD)

Ces écarts vs brainstorm **ne sont pas des oublis** : ils sont explicitement décidés dans `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/.memlog.md`.

| Divergence | Brainstorm | PRD | Memlog PRD |
|------------|------------|-----|------------|
| **Contact fin** | Tél / **WhatsApp** | **Téléphone ou email** ; WhatsApp **pas** champ V1 (FR-14) | `(decision) Contact opt-in… téléphone OU email (pas WhatsApp…)` |
| **Reconnaissance 2e visite** | « même contact **ou** soft cookie » (formulation exclusive soft) | **Les deux** : soft auto **et** ressaisie volontaire tél/email (FR-16, FR-17) | `(decision) Reconnaissance… soft auto ET ressaisie…` |
| **Paiement** | Non mentionné (ni in ni out) | **Hors produit** explicite — non prévu (Non-goals ; §6.2) | `(decision) Paiement digital hors produit…` |
| **Back-office** | Hors intent client (implicite côté métier) | **Ajouté** : UJ-3 + FR-7, FR-10, FR-20 (menu + commandes + auth staff) | `(decision) Features V1: 7 blocs client + back-office…` ; `UJ-3 Back-office validée` |

**Note identité :** le tableau « Identité client » de l’intent (fin = tél/WhatsApp) est volontairement remplacé par tél/email ; la double reconnaissance est un **renforcement** produit, pas une perte.

---

## 3. Gaps — idées / décisions brainstorm absentes ou affaiblies dans le PRD

### 3.1 Qualitatif critique (tone / feel / heat / chef)

| # | Gap | Brainstorm (intent / décision memlog) | PRD actuel | Sévérité |
|---|-----|----------------------------------------|------------|----------|
| G1 | **Chaleur sur chaque écran** | Décision dial : *chaque écran = « bienvenue à la maison »* | §8 centre la chaleur sur **ambiance + chef en fin** ; Vision dit « fin chaleureuse » ; pas d’exigence testable « chaleur à chaque écran » | **Haute** |
| G2 | **Message chef selon avis** | Intent : animation chef + *message adapté selon l’avis* ; memlog : 3 scripts (super/ok/mitigé) | FR-15 = clôture chaleureuse ; pas de FR sur scripts / ton conditionné à la note | **Haute** |
| G3 | **Voix maison concrète** | Memlog : tutoiement doux, phrases courtes type *« Pose-toi »*, *« On s’occupe de toi »* ; zéro langage app froid | §8 : tutoiement « acceptable » + ban Submit/Login — **exemples / règles de voix** absents | Moyenne |
| G4 | **Primauté visuelle sur copy UI** | Décision : chaleur via *images/ambiance + ton chef*, **pas surtout les mots UI** | Présent en §8 / FR-15 mais **non relié** aux écrans menu/commande/service (risque de UI « froide » hors fin) | Moyenne |

### 3.2 Flux / UX (hors divergences intentionnelles)

| # | Gap | Brainstorm | PRD | Sévérité |
|---|-----|------------|-----|----------|
| G5 | **Anti-abandon explicite** | Memlog coach : chapitres optionnels, skip partout, avis = 2 taps + contact optionnel | Skip / optionnalité hors avis+contact peu normés ; FR-13–14 couvrent le court avis + contact optionnel, mais **pas** « tout optionnel sauf le but du scan » | Moyenne |
| G6 | **Bannière soft de reprise** | Idée coach : *« Tu en étais à… »* après refresh/crash | FR-3 exige reprise à l’étape ; **pas** de copy/UI de reprise | Basse (idée, pas décision user) |
| G7 | **Contact juste après l’émotion du merci** | Memlog : contact après émotion chef ; fantasy « garde mon goût… » | Ordre PRD : avis → contact → **puis** merci chef (FR-13→14→15) — **ordre inverse** vs pont émotionnel brainstorm | Moyenne (ordre non figé en décision user, mais écart sensible) |
| G8 | **Serveur/cuisine voit les goûts** | Memlog : goûts proposés 1 tap **et** visibles serveur/cuisine | Goûts stockés (FR-9) ; **aucune** FR back-office « voir goûts client » | Moyenne |
| G9 | **Artefact / preuve mémoire douce** | Memlog futur : notif WhatsApp goûts / sticker — hors V1 OK ; mais *« On te remet le même ? »* en accueil mémoire | FR-18–19 affichent préférés + 1 tap ; **pas** de phrasing accueil type « Bon retour / On te remet le même ? » | Basse–moyenne |

### 3.3 Non-gaps (ne pas « corriger »)

- WhatsApp comme canal de saisie → divergence intentionnelle.
- Soft **ou** contact → remplacé par soft **et** ressaisie → divergence intentionnelle.
- Back-office / pas de paiement → ajouts intentionnels.
- Google soft / 3D / avantages / allergies → déjà hors MVP comme prévu.

---

## 4. Qualitative drops (tone / voice / feel) — synthèse

Ce que le brainstorm avait **figé comme émotion produit** et que le PRD **amincit** :

1. **Dial chaleur globale** → réduit à une section Aesthetic courte + fin chef ; le mandat *« chaque écran = maison »* disparaît des FR / consequences testables.
2. **Chef comme convertisseur émotionnel** → reste une clôture visuelle ; le *message branché sur l’avis* (3 tons) n’est plus une exigence.
3. **Lexique maison** (Pose-toi, On s’occupe de toi) → remplacé par « tutoiement acceptable » sans guide de voix.
4. **Ordre émotionnel fin** (merci / émotion → contact) vs PRD (contact → merci) — risque de re-froidir le moment où le brainstorm voulait convertir.
5. **Accueil 2e visite incarné** (« Bon retour… ») → mémoire fonctionnelle (listes + 1 tap) sans ton de retrouvailles.

Ce qui est **bien préservé** qualitativement : anti-jargon froid en fin ; ambiance + chef comme vecteurs principaux ; anti-surcharge / micro-missions ; persona Mame Fatou.

---

## 5. Recommended PRD fixes (pour passer à « ok »)

Sans rouvrir les divergences intentionnelles (tél/email, dual recognition, no payment, back-office) :

1. **§8 + FR transversale (ou FR-5 companion)** — Exiger chaleur « maison » sur le parcours client (pas seulement la fin) ; consequences testables (copy/ambiance, pas de jargon froid hors back-office).
2. **FR-15** — Ajouter *message chef conditionné à l’avis* (min. 3 tons : super / ok / mitigé) ; garder 2D V1.
3. **§8 Voice** — 3–5 exemples de phrases autorisées / interdites (maison vs app).
4. **Clarifier ordre fin** — Soit documenter l’ordre avis → contact → chef comme choix PRD, soit réaligner sur *émotion chef puis contact* si on veut coller au brainstorm.
5. **FR back-office goûts** (optionnel mais utile) — Affichage des goûts cuisine liés à la commande/table pour la salle.
6. **UJ-2 copy** — Une ligne d’accueil mémoire chaleureuse (« Bon retour » / suggestion douce du préféré) sans réintroduire avantages.

---

## 6. Verdict

| Critère | Statut |
|---------|--------|
| Cœur produit / flux / 2 QR / session / mémoire / non-goals | **OK** |
| Divergences contact / reconnaissance / paiement / BO | **Intentionnelles — OK** |
| Qualitatif chaleur / voix / chef selon avis | **Gaps — needs fixes** |

**Verdict global : needs fixes**
