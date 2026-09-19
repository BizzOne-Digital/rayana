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
  "Each module is CAD $40 · All Level 1 modules are a prerequisite — message Rayana for Level 2 entry";

const LEVEL2_INTRO = `<p><strong>Level 2: The Study of the 5 Paired Out-of-Body Chakras</strong> — very much experiential… getting to know them!</p>
<p><em>All Level 1 modules are a prerequisite to entering this second level. Send a message to Rayana for entry by purchase.</em></p>`;

const CHAKRA_1_DESC = `<p>Learn to set your personal alignment (energy), with intention.</p>
<p>Explore your deeper beliefs about what it means to be connected to the earth and your relationship to your survival. Important to observe and shift in the turbulent times in which we live!</p>`;

const CHAKRA_2_DESC = `<p>Continuing setting your personal alignment. Learning to set the energy for your personal external space e.g. home, bedroom, office, etc.</p>
<p>Explore your understanding around your sexuality and creativity and what is getting in the way of letting the energy flow.</p>
<p>This is the seat of clairsentient abilities… our ability to sense/feel energy around us.</p>`;

const CHAKRA_3_DESC = `<p>A very important chakra for our times. You will discover what power, will, food and money beliefs you are embodying presently, that may not be serving you, and learn to evolve into a belief that better serves you.</p>`;

const CHAKRA_4_DESC = `<p>The Heart… seat of our wisdom. You discover sitting on top of it, accumulated from life's experiences and how to begin the process of creating something more meaningful.</p>
<p>It is the bridge to more lasting transformation.</p>
<p>Uncover the misunderstandings we have about love, compassion and truth and begin a transformative journey now.</p>`;

const CHAKRA_5_DESC = `<p>Seat of Clairaudience which is our ability to hear others' thoughts and communication with the spirit world.</p>
<p>Learn how to own your space and speak your truth by transforming beliefs into greater truth.</p>`;

const CHAKRA_6_DESC = `<p>Seat of Clairvoyance… our ability to &quot;see&quot; clearly.</p>
<p>Learn to evolve beyond any current limiting perceptions of what it means to &quot;see&quot; clearly and build more safety and trust to allow yourself to allow this ability to unfold.</p>`;

const CHAKRA_7_DESC = `<p>Explore any assumptions that get in the way of our interconnectedness.</p>
<p>Learn to consciously open to collective consciousness of which you are a part, and expand your energy out into the universe.</p>`;

const CHAKRA_8_DESC = `<p><strong>Chakra 8: Creative Ring</strong></p>
<p><strong>Upper — The Cosmic Regulator:</strong> Learn how to filter, temper and purify universal energy in a way that makes it comfortable for the body to receive it for use.</p>
<p><strong>Lower — The Earth Regulator:</strong> Learn how to filter, temper and purify earth energy to make it more comfortable to the body.</p>`;

const CHAKRA_9_DESC = `<p><strong>Chakra 9: Creative Ring</strong></p>
<p><strong>Upper:</strong> Laboratory to &quot;tinker&quot; and create personal reality. What is probable and based on the present situation and information with which you are experimenting.</p>
<p><strong>Lower:</strong> Use the downward pull of gravity to transform the ideas created in the Upper 9th and bring into a denser form and into the physical reality.</p>`;

const CHAKRA_10_DESC = `<p><strong>Chakra 10: Creative Ring</strong></p>
<p><strong>Upper:</strong> Learn to invent new and create a new personal reality. It is the realm of possibilities.</p>
<p><strong>Lower:</strong> Learn to begin manifesting new combinations of possibilities. It is about potential energy.</p>`;

const CHAKRA_11_DESC = `<p><strong>Chakra 11: Unity Ring</strong></p>
<p><strong>Upper:</strong> Understanding the Oneness of a group from a non-ego state. It is immeasurable meaning there is less information to share; taking you out to experience and gather information of your own.</p>
<p><strong>Lower:</strong> Learn how to deepen trust and what you believe is possible for you; helping you to understand the oneness and non-ego state. It is about learning to forgive and let go.</p>`;

const CHAKRA_12_DESC = `<p><strong>Chakra 12: Unity Ring</strong></p>
<p><strong>Upper:</strong> Taking you out to experience the Infinite in all that is around us. It is immeasurable.</p>
<p><strong>Lower:</strong> Learning to deepen your ability to surrender to greater aspects of self, and softening into inviting in what you want.</p>`;

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
    description: descriptionHtml ?? "<p>Module description coming soon.</p>",
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
  chakraProduct(
    1,
    "Chakra 1: Sacrum Chakra",
    "Survival, connection to the earth, personal alignment",
    "foundation",
    1,
    40,
    CHAKRA_1_DESC,
  ),
  chakraProduct(
    2,
    "Chakra 2: Navel Chakra",
    "Sexuality, creativity, clairsentience, your personal space",
    "foundation",
    2,
    40,
    CHAKRA_2_DESC,
  ),
  chakraProduct(
    3,
    "Chakra 3: Solar Plexus Chakra",
    "Power, will, food and money beliefs",
    "foundation",
    3,
    40,
    CHAKRA_3_DESC,
  ),
  chakraProduct(
    4,
    "Chakra 4: Heart Chakra",
    "Wisdom, love, compassion, truth, transformation",
    "foundation",
    4,
    40,
    CHAKRA_4_DESC,
  ),
  chakraProduct(
    5,
    "Chakra 5: Throat Chakra",
    "Clairaudience, owning your space, speaking your truth",
    "foundation",
    5,
    40,
    CHAKRA_5_DESC,
  ),
  chakraProduct(
    6,
    "Chakra 6: Third Eye Chakra",
    "Clairvoyance — learning to see clearly",
    "foundation",
    6,
    40,
    CHAKRA_6_DESC,
  ),
  chakraProduct(
    7,
    "Chakra 7: Crown Chakra",
    "Interconnectedness and collective consciousness",
    "foundation",
    7,
    40,
    CHAKRA_7_DESC,
  ),
];

export const SHOP_OUT_OF_BODY_PRODUCTS: ShopCatalogItem[] = [
  chakraProduct(
    0,
    "Free Introduction",
    "Sample the paired chakra teachings—free to explore.",
    "out-of-body",
    10,
    0,
    `<p>A complimentary introduction to the out-of-body chakra pairings before purchasing individual modules.</p>${LEVEL2_INTRO}`,
  ),
  chakraProduct(
    8,
    "Chakra 8: Creative Ring",
    "Cosmic & Earth energy regulators",
    "out-of-body",
    11,
    40,
    CHAKRA_8_DESC,
  ),
  chakraProduct(
    9,
    "Chakra 9: Creative Ring",
    "Personal reality — upper & lower",
    "out-of-body",
    12,
    40,
    CHAKRA_9_DESC,
  ),
  chakraProduct(
    10,
    "Chakra 10: Creative Ring",
    "Possibilities and potential energy",
    "out-of-body",
    13,
    40,
    CHAKRA_10_DESC,
  ),
  chakraProduct(
    11,
    "Chakra 11: Unity Ring",
    "Oneness, trust, forgiveness",
    "out-of-body",
    14,
    40,
    CHAKRA_11_DESC,
  ),
  chakraProduct(
    12,
    "Chakra 12: Unity Ring",
    "The Infinite — surrender and invitation",
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
