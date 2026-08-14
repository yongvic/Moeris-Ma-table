/**
 * Configuration & organisation des menus sous forme d'images.
 */
export const USE_IMAGE_MENU = true;

export type MenuCategoryKey = "fast_food" | "menu_simple" | "vip";

export type MenuCategoryInfo = {
  key: MenuCategoryKey;
  label: string;
  badge: string;
  icon: string;
  description: string;
};

export const MENU_CATEGORIES: MenuCategoryInfo[] = [
  {
    key: "fast_food",
    label: "Fast-Food",
    badge: "Rapide & Gourmand",
    icon: "🍔",
    description: "Pizzas, pâtes, snacks, burgers et boissons fraîches.",
  },
  {
    key: "menu_simple",
    label: "Menu Simple",
    badge: "Carte Classic",
    icon: "🍽️",
    description: "Plats africains, grillades, petit-déjeuner et desserts.",
  },
  {
    key: "vip",
    label: "VIP & Prestige",
    badge: "Expérience Élite",
    icon: "✨",
    description: "Vins fins, champagnes, alcools d'exception et poissons nobles.",
  },
];

export type MenuPageImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: MenuCategoryKey;
  tag?: string;
};

/** Pages de la carte classées par univers. */
export const MENU_PAGE_IMAGES: MenuPageImage[] = [
  // --- FAST-FOOD ---
  {
    id: "ff-pizza",
    src: "/menu-pages/09-pizza.png",
    alt: "Pizzas artisanales — Résidence Moeris",
    title: "Pizzas Artisanales",
    category: "fast_food",
    tag: "Populaire",
  },
  {
    id: "ff-pates-snacks",
    src: "/menu-pages/10-pates-snacks.png",
    alt: "Pâtes, snacks et casse-croûtes",
    title: "Pâtes, Snacks & Casse-Croûtes",
    category: "fast_food",
    tag: "Snacking",
  },
  {
    id: "ff-jus-cocktails",
    src: "/menu-pages/04-jus-cocktails.png",
    alt: "Jus frais, boissons chaudes et cocktails",
    title: "Jus Frais & Cocktails Softs",
    category: "fast_food",
    tag: "Boissons",
  },

  // --- MENU SIMPLE (CLASSIC) ---
  {
    id: "ms-cover",
    src: "/menu-pages/01-cover-menu.png",
    alt: "Présentation de la carte — Résidence Moeris",
    title: "Présentation de la Carte",
    category: "menu_simple",
    tag: "Accueil",
  },
  {
    id: "ms-petit-dej",
    src: "/menu-pages/06-petit-dej-entrees.png",
    alt: "Petit-déjeuner, entrées et soupes",
    title: "Petit-Déjeuner, Entrées & Soupes",
    category: "menu_simple",
    tag: "Matin & Entrées",
  },
  {
    id: "ms-grillades",
    src: "/menu-pages/08-grillades-africains.png",
    alt: "Grillades barbecue, garnitures et plats africains",
    title: "Grillades Barbecue & Plats Africains",
    category: "menu_simple",
    tag: "Spécialités",
  },
  {
    id: "ms-boissons",
    src: "/menu-pages/02-carte-boissons.png",
    alt: "Carte des boissons et rafraîchissements",
    title: "Boissons & Rafraîchissements",
    category: "menu_simple",
    tag: "Rafraîchissements",
  },
  {
    id: "ms-desserts",
    src: "/menu-pages/11-desserts.png",
    alt: "Desserts et douceurs",
    title: "Desserts & Gourmandises",
    category: "menu_simple",
    tag: "Douceurs",
  },

  // --- VIP & PRESTIGE ---
  {
    id: "vip-vins",
    src: "/menu-pages/05-vins-champagnes.png",
    alt: "Vins fins, grands crus et champagnes prestige",
    title: "Vins Fins, Grands Crus & Champagnes",
    category: "vip",
    tag: "Exception",
  },
  {
    id: "vip-alcools",
    src: "/menu-pages/03-alcools.png",
    alt: "Alcools d'exception, whiskies et bouteilles de prestige",
    title: "Alcools & Bouteilles de Prestige",
    category: "vip",
    tag: "Prestige",
  },
  {
    id: "vip-poissons",
    src: "/menu-pages/07-poissons-viandes.png",
    alt: "Poissons nobles, fruits de mer et viandes braisées",
    title: "Poissons Nobles & Viandes d'Exception",
    category: "vip",
    tag: "Gastronomie",
  },
];
