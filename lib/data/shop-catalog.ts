export type ShopCatalogItem = {
  slug: string;
  name: string;
  /** Short line on shop cards (Rayana can override in Admin → Products). */
  summary: string;
  description: string;
  price: number;
  featured?: boolean;
  displayOrder: number;
  tier: "foundation" | "out-of-body";
  chakraNumber?: number;
};

export const SHOP_INTRO =
  "Stand-alone modules for individuals to study at your leisure. Each module is a self-paced recorded teaching you can purchase individually—ideal if you are not ready for a live 12-week course.";

export const SHOP_FOUNDATION_TITLE = "Level 1 · Main In-Body Chakras";
export const SHOP_FOUNDATION_SUBTITLE = "The Foundation: Major In-Body Chakras";
export const SHOP_FOUNDATION_NOTE = "Each module is CAD $40 · Free intro to sample";

export const SHOP_OUT_OF_BODY_TITLE = "Level 2 · Five Paired Chakras";
export const SHOP_OUT_OF_BODY_SUBTITLE = "After the Foundation: Major Out-of-Body Chakras Paired";
export const SHOP_OUT_OF_BODY_NOTE =
  "Each module is CAD $40 · Level 1 foundation recommended";

const PLACEHOLDER_DETAIL =
  "<p>Rayana will add the full module description here. You can edit this anytime in the admin under <strong>Products</strong>.</p>";

function chakraProduct(
  n: number,
  label: string,
  tagline: string,
  tier: "foundation" | "out-of-body",
  order: number,
  price = 0,
  descriptionHtml?: string,
): ShopCatalogItem {
  const isFree = price === 0;
  return {
    slug: isFree ? `intro-${tier}` : `chakra-${n}`,
    name: isFree ? "Free Introduction" : label,
    summary: tagline,
    description: descriptionHtml ?? PLACEHOLDER_DETAIL,
    price,
    displayOrder: order,
    featured: isFree,
    tier,
    chakraNumber: isFree ? undefined : n,
  };
}

export const SHOP_FOUNDATION_PRODUCTS: ShopCatalogItem[] = [
  chakraProduct(
    0,
    "Free Introduction",
    "Sample the teaching style and approach—free to explore.",
    "foundation",
    0,
    0,
    "<p>A complimentary introduction to Rayana's recorded chakra teachings. Experience the tone, depth, and practical approach before choosing individual modules.</p>",
  ),
  chakraProduct(1, "Chakra 1", "Survival, Connection to the Earth", "foundation", 1, 40),
  chakraProduct(2, "Chakra 2", "Sexuality, Creativity… Clairsentient centre", "foundation", 2, 40),
  chakraProduct(3, "Chakra 3", "Power, Will, Food, Money", "foundation", 3, 40),
  chakraProduct(
    4,
    "Chakra 4",
    "Bridge for Transformation… Love, Compassion, Truth",
    "foundation",
    4,
    40,
  ),
  chakraProduct(
    5,
    "Chakra 5",
    "Owning Your Space, Speaking Your Truth… Clairaudience centre",
    "foundation",
    5,
    40,
  ),
  chakraProduct(6, "Chakra 6", 'Ability to "See" Clearly… Clairvoyance centre', "foundation", 6, 40),
  chakraProduct(7, "Chakra 7", "About All Consciousness of Which We are A Part", "foundation", 7, 40),
];

const CHAKRA_8_DESC = `<p><strong>Upper:</strong> Cosmic Energy Regulator</p><p><strong>Lower:</strong> Earth Energy Regulator</p>${PLACEHOLDER_DETAIL}`;
const CHAKRA_9_DESC = `<p><strong>Upper:</strong> Creates Personal Reality</p><p><strong>Lower:</strong> Expedites Probabilities Created in Upper 9th</p>${PLACEHOLDER_DETAIL}`;
const CHAKRA_10_DESC = `<p><strong>Upper:</strong> Invents and Creates New Ideas for Personal Reality</p><p><strong>Lower:</strong> Manifests New Combinations of Matter</p>${PLACEHOLDER_DETAIL}`;
const CHAKRA_11_DESC = `<p><strong>Upper:</strong> Understanding Oneness of a Group; Non-Ego State</p><p><strong>Lower:</strong> About Trusting… What I believe is possible (non-ego state), Understanding Oneness</p>${PLACEHOLDER_DETAIL}`;
const CHAKRA_12_DESC = `<p><strong>Upper:</strong> The Infinity That is All Around Us Allowing Us "To Be"</p><p><strong>Lower:</strong> Surrendering into Greater Aspects of Self; Inviting in What We Want</p>${PLACEHOLDER_DETAIL}`;

export const SHOP_OUT_OF_BODY_PRODUCTS: ShopCatalogItem[] = [
  chakraProduct(
    0,
    "Free Introduction",
    "Sample the paired chakra teachings—free to explore.",
    "out-of-body",
    10,
    0,
    "<p>A complimentary introduction to the out-of-body chakra pairings before purchasing individual modules.</p>",
  ),
  chakraProduct(
    8,
    "Chakra 8",
    "Cosmic & Earth energy regulators (above and below)",
    "out-of-body",
    11,
    40,
    CHAKRA_8_DESC,
  ),
  chakraProduct(
    9,
    "Chakra 9",
    "Personal reality & expedited probabilities (above and below)",
    "out-of-body",
    12,
    40,
    CHAKRA_9_DESC,
  ),
  chakraProduct(
    10,
    "Chakra 10",
    "New ideas & manifesting matter (above and below)",
    "out-of-body",
    13,
    40,
    CHAKRA_10_DESC,
  ),
  chakraProduct(
    11,
    "Chakra 11",
    "Group oneness & trusting what is possible (above and below)",
    "out-of-body",
    14,
    40,
    CHAKRA_11_DESC,
  ),
  chakraProduct(
    12,
    "Chakra 12",
    "Infinity, surrender & greater aspects of self (above and below)",
    "out-of-body",
    15,
    40,
    CHAKRA_12_DESC,
  ),
];

export const ALL_SHOP_PRODUCTS: ShopCatalogItem[] = [
  ...SHOP_FOUNDATION_PRODUCTS,
  ...SHOP_OUT_OF_BODY_PRODUCTS,
];

export function shopProductTier(slug: string): "foundation" | "out-of-body" | null {
  if (slug === "intro-foundation") return "foundation";
  if (slug === "intro-out-of-body") return "out-of-body";
  const match = /^chakra-(\d+)$/.exec(slug);
  if (!match) return null;
  const n = Number(match[1]);
  if (n >= 1 && n <= 7) return "foundation";
  if (n >= 8 && n <= 12) return "out-of-body";
  return null;
}

export function partitionPublishedProducts<T extends { slug: string; displayOrder?: number }>(
  products: T[],
): { foundation: T[]; outOfBody: T[] } {
  const sorted = [...products].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const foundation: T[] = [];
  const outOfBody: T[] = [];
  for (const item of sorted) {
    const tier = shopProductTier(item.slug);
    if (tier === "foundation") foundation.push(item);
    else if (tier === "out-of-body") outOfBody.push(item);
  }
  return { foundation, outOfBody };
}
