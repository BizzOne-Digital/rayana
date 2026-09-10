export type ShopCatalogItem = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  price: number;
  featured?: boolean;
  displayOrder: number;
};

export const SHOP_INTRO =
  "Stand-alone modules for individuals to study at your leisure. Each module is a self-paced recorded teaching you can purchase individually—ideal if you are not ready for a live 12-week course.";

export const SHOP_FOUNDATION_TITLE = "The Foundation: Major In-Body Chakras";
export const SHOP_FOUNDATION_NOTE = "Each module is CAD $40";

export const SHOP_OUT_OF_BODY_TITLE = "After the Foundation: Major Out-of-Body Chakras Paired";
export const SHOP_OUT_OF_BODY_NOTE = "Each module is CAD $40 · Level 1 foundation recommended";

function chakraProduct(
  n: number,
  label: string,
  tier: "foundation" | "out-of-body",
  order: number,
  price = 0,
): ShopCatalogItem {
  const isFree = price === 0;
  return {
    slug: isFree ? `intro-${tier}` : `chakra-${n}`,
    name: isFree ? "Free Introduction" : label,
    summary: isFree
      ? "Sample the teaching style and approach—free to explore."
      : `Self-paced recorded module on ${label.toLowerCase()}.`,
    description: isFree
      ? "<p>A complimentary introduction to Rayana's recorded chakra teachings. Experience the tone, depth, and practical approach before choosing individual modules.</p>"
      : `<p>An in-depth recorded teaching on ${label}. Study at your own pace with practical guidance for understanding and working with this energy centre.</p>`,
    price,
    displayOrder: order,
    featured: isFree,
  };
}

export const SHOP_FOUNDATION_PRODUCTS: ShopCatalogItem[] = [
  chakraProduct(0, "Free Introduction", "foundation", 0, 0),
  chakraProduct(1, "Chakra 1", "foundation", 1, 40),
  chakraProduct(2, "Chakra 2", "foundation", 2, 40),
  chakraProduct(3, "Chakra 3", "foundation", 3, 40),
  chakraProduct(4, "Chakra 4", "foundation", 4, 40),
  chakraProduct(5, "Chakra 5", "foundation", 5, 40),
  chakraProduct(6, "Chakra 6", "foundation", 6, 40),
  chakraProduct(7, "Chakra 7", "foundation", 7, 40),
];

export const SHOP_OUT_OF_BODY_PRODUCTS: ShopCatalogItem[] = [
  chakraProduct(0, "Free Introduction", "out-of-body", 10, 0),
  chakraProduct(8, "Chakra 8: Above and Below", "out-of-body", 11, 40),
  chakraProduct(9, "Chakra 9: Above and Below", "out-of-body", 12, 40),
  chakraProduct(10, "Chakra 10: Above and Below", "out-of-body", 13, 40),
  chakraProduct(11, "Chakra 11: Above and Below", "out-of-body", 14, 40),
  chakraProduct(12, "Chakra 12: Above and Below", "out-of-body", 15, 40),
];

export const ALL_SHOP_PRODUCTS: ShopCatalogItem[] = [
  ...SHOP_FOUNDATION_PRODUCTS,
  ...SHOP_OUT_OF_BODY_PRODUCTS,
];
