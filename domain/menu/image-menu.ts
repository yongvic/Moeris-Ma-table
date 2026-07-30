/**
 * Affichage menu client.
 * - `true`  → pages images (carte design) — mode actuel
 * - `false` → ancienne grille de plats cliquables (commande en ligne)
 *
 * Pour réactiver la logique interactive : passer à `false`.
 */
export const USE_IMAGE_MENU = true;

export type MenuPageImage = {
  src: string;
  alt: string;
  title: string;
};

/** Pages de la carte, dans l’ordre de lecture. */
export const MENU_PAGE_IMAGES: MenuPageImage[] = [
  {
    src: "/menu-pages/01-cover-menu.png",
    alt: "Couverture Menu — Résidence Moeris",
    title: "Menu",
  },
  {
    src: "/menu-pages/02-carte-boissons.png",
    alt: "Couverture Carte Boissons — Résidence Moeris",
    title: "Carte Boissons",
  },
  {
    src: "/menu-pages/03-alcools.png",
    alt: "Alcools, bières et softs",
    title: "Alcools & Bières",
  },
  {
    src: "/menu-pages/04-jus-cocktails.png",
    alt: "Jus, eaux, boissons chaudes et cocktails alcoolisés",
    title: "Jus & Cocktails",
  },
  {
    src: "/menu-pages/05-vins-champagnes.png",
    alt: "Cocktails sans alcool, vins et champagnes",
    title: "Vins & Champagnes",
  },
  {
    src: "/menu-pages/06-petit-dej-entrees.png",
    alt: "Petit-déjeuner, entrées et soupes",
    title: "Petit-déj & Entrées",
  },
  {
    src: "/menu-pages/07-poissons-viandes.png",
    alt: "Poissons, fruits de mer, viandes et volailles",
    title: "Poissons & Viandes",
  },
  {
    src: "/menu-pages/08-grillades-africains.png",
    alt: "Grillades barbecue, garnitures et plats africains",
    title: "Grillades & Africains",
  },
  {
    src: "/menu-pages/09-pizza.png",
    alt: "Pizzas",
    title: "Pizza",
  },
  {
    src: "/menu-pages/10-pates-snacks.png",
    alt: "Pâtes, snacks et casse-croûtes",
    title: "Pâtes & Snacks",
  },
  {
    src: "/menu-pages/11-desserts.png",
    alt: "Desserts",
    title: "Desserts",
  },
];
