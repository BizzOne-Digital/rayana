import type { PublicFAQ, PublicTestimonial, TypedPageSection } from "@/lib/sections/types";
import { SEED_IMAGES } from "@/lib/data/seed-images";

function btn(
  label: string,
  href: string,
  variant: "primary" | "secondary" | "ghost" = "primary",
) {
  return { label, href, variant, openInNewTab: false };
}

function section(
  id: string,
  type: string,
  order: number,
  data: Partial<TypedPageSection> = {},
): TypedPageSection {
  return {
    id,
    type,
    label: data.label ?? type,
    enabled: true,
    order,
    eyebrow: "",
    heading: "",
    body: "",
    buttons: [],
    images: [],
    layoutVariant: "default",
    themeVariant: "default",
    items: [],
    settings: {},
    ...data,
  };
}

export const RAYANA_OPENING_BODY = `<p>This is a story of a woman who spent her life learning how to "see, feel and sense", and eventually realized that her greatest gift is to help others "see, feel and sense" too.</p>
<p>Rayana helps us see beneath the surface of our lives — to understand the patterns, truths, and deeper wisdom shaping our experience. In this way, we become able to meet life with greater clarity, consciousness and sovereignty, to ultimately transform our presence and our life.</p>
<p>Rayana helps us see what we couldn't previously see about ourselves, about our lives and about what truly matters. She helps transform uncertainty into understanding and wisdom, to be used daily.</p>`;

export const RAYANA_STORY_BODY = `<p>Rayana De Silva has spent her life exploring what lies beneath the surface of human experience…seeking to understand consciousness, love, relationships, suffering, transformation and the deeper truth of who we are.</p>
<p>Through a life marked by profound experiences, questioning, spiritual exploration, and challenges and transformation, she has learned that the answers we seek externally often begin with learning to see ourselves more truthfully.</p>
<p>Rayana came to understand that our experiences are not merely things that happen to us. They can become mirrors — revealing unconscious patterns, beliefs, wounds, desires, attachments, and places where we have lost connection with our own inner knowing. Our challenges then can become our path to enlightenment.</p>
<p>Rayana developed a way of "seeing" that brings together intuition, the wisdom heart, discernment and the lived experience. She learned to look beneath appearances to recognize what is actually happening beneath the story we tell ourselves or the circumstances we are facing.</p>
<p>Today, she shares that understanding with others. Her work is not about telling us who we should be or giving us answers to live by. It is about helping us to "see and feel and sense" deeply so we can recognize what is true, understand what our experience is revealing, and make choices from a place of greater consciousness and sovereignty.</p>
<p>At the heart of her work is a simple belief: When we learn to see more deeply, we understand ourselves more honestly. When we understand ourselves more honestly, we become free to live more consciously, and create the life we want.</p>
<p>This, at its heart, is what "A deeper way of seeing what matters" means.</p>
<p>She offers her expertise with over 30 years of professional and international experience in private practice, and as an educator.</p>`;

export const RAYANA_BRINGS_ITEMS = [
  "You are at a crossroads",
  "Something in your life no longer fits",
  "You are seeking clarity in love and relationships",
  "You are questioning the direction of your life",
  "You know there is something deeper you are meant to understand",
  "You are ready to live with greater consciousness and integrity",
  "You are wanting to find freedom from the suffering created in your mind",
];

export const RAYANA_HOME_SECTIONS: TypedPageSection[] = [
  section("home-hero", "hero", 0, {
    heading: "A Deeper Way of Seeing What Matters",
    body: "<p>Clarity · Consciousness · Truth · Presence</p>",
    buttons: [
      btn("Work With Me", "/services"),
      btn("My Story", "/about", "secondary"),
    ],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-welcome", "splitStory", 1, {
    eyebrow: "Clarity · Consciousness · Truth · Presence",
    heading: "See Beneath the Surface",
    body: RAYANA_OPENING_BODY,
    images: [SEED_IMAGES.portrait2],
    buttons: [btn("Read My Full Story", "/about", "secondary")],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-story", "richText", 2, {
    eyebrow: "About",
    heading: "My Story",
    body: RAYANA_STORY_BODY,
    images: [SEED_IMAGES.portrait1],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-brings", "iconList", 3, {
    eyebrow: "Is This You?",
    heading: "What Brings You Here?",
    items: RAYANA_BRINGS_ITEMS.map((title) => ({ title, body: "", icon: "heart" })),
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-philosophy", "richText", 4, {
    eyebrow: "My Philosophy",
    heading: "The Wisdom Heart",
    body: "<p>Understanding yourself deeply through the lens of the wisdom heart changes how you understand and move through the world.</p>",
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-method", "numberedSteps", 5, {
    eyebrow: "How I Work",
    heading: "See · Understand · Integrate",
    items: [
      {
        title: "See",
        body: "What is actually happening.",
      },
      {
        title: "Understand",
        body: "What lies beneath the pattern.",
      },
      {
        title: "Integrate",
        body: "How to move forward with greater truth, consciousness, and from a deeper presence.",
      },
    ],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-offerings", "serviceShowcase", 6, {
    eyebrow: "Work With Me",
    heading: "Ways to Work Together",
    settings: { limit: 5, featuredOnly: false },
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-testimonials", "testimonialSlider", 7, {
    eyebrow: "Testimonials",
    heading: "From the Heart",
    body: "<p>Read the full reflections on the testimonials page.</p>",
    buttons: [btn("All Testimonials", "/testimonials", "secondary")],
    settings: { featuredOnly: true, limit: 8 },
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-media", "mediaFeature", 8, {
    eyebrow: "Media",
    heading: "Latest Video, Podcast & Teaching",
    body: "<p>New teachings and media will appear here — most likely via YouTube. Nothing to share just yet; please check back soon.</p>",
    settings: { contentType: "media", limit: 3 },
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-cta", "bookingCTA", 9, {
    heading: "Begin Where You Are",
    body: "<p>Centre yourself. Bring your questions. Allow space for what wants to be seen.</p>",
    buttons: [btn("Book a Session", "/booking")],
    images: [SEED_IMAGES.sacred],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
];

export const RAYANA_TESTIMONIALS: PublicTestimonial[] = [
  {
    slug: "a-kozelsky",
    name: "A. Kozelsky",
    role: "Social Worker/Therapist",
    quote:
      "Over the last several years, I've been on a healing journey and have had the pleasure of working with Rayana. She has helped me develop a deep spiritual awareness of myself, which was a part of me that I was previously entirely disconnected from. Rayana is able to quickly hone in on core issues and present them in a clear, nonjudgmental way that inspires change. You think you're going in with one problem, but you finish with such a deeper understanding of yourself on all levels. Rayana also provides practical advice on moving forward as well as in-session healing, resulting in immediate soothing and comfort. The growth that I've experienced as a result of Rayana's guidance is invaluable, and I am so grateful for her support!",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "i-shecter",
    name: "I. Shecter",
    role: "Tour Guide/Entrepreneur",
    quote:
      "I am grateful for Rayana's presence in my life on many accounts. From the very beginning, her support on my journey has been constant, steady, and comforting. Her insights and perspective are pragmatic and relatable, and have aided me in creating an authentic and stable foundation from which to grow. I have felt heard and understood throughout our work together, in large part due to her active and accomplished listening skills. Rayana creates deeply powerful safe spaces and fills them with compassion, providing me with the opportunity to expose my vulnerabilities without shame or fear of judgement. Rayana's honesty and transparency are values that she embodies in her work, as her no-nonsense approach provided the extra push I needed to be more truthful with myself. I also appreciate her ability to maintain a keen sense of humour, even when faced with challenging circumstances. Thank you for everything, Rayana.",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "n-boroumand",
    name: "N. Boroumand",
    role: "Teacher/Environmentalist",
    quote:
      "I am deeply grateful that Rayana came into my life, for I know that without her insights and guidance, I would still be living an unfulfilling and uncreative life. I knew something about my life was not quite right, but I could not figure out what it was nor what steps I could take to address it. Rayana was able to direct me in exactly the directions that have helped me turn my life from mediocre to deeply fulfilling. She was able to tap deep into the core of the problems, and guide me in profound ways that allowed me to take actions that have transformed my life in long-term and sustainable ways, and seem to expand daily. Rayana has truly been a gift to my existence.",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "m-rogers",
    name: "M. Rogers",
    role: "Chief Coaching Officer",
    quote:
      "Hi Rayana, we spoke on Sunday. Well, you spoke and I listened and learned. OK, I made jokes too! Thank you for your insights and for your intuitive gift. Your connection to the higher truth about my path was heart-warming, validating and, in case you didn't already know, extremely accurate. You helped to add another layer to the picture I am manifesting—or perhaps the picture I am being manifested into. Many thanks. You are a wonderful addition to my world.",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "d-merizzi",
    name: "D. Merizzi",
    role: "Senior Business Analyst",
    quote:
      "Rayana offered to help when I was feeling unsure about a direction in my career search. With her natural and easy approach, Rayana shared her intuition with me as it appeared in her mind's eye. I went to the interviews we had discussed with confidence and was truly amazed at how accurate Rayana had been in regard to both the approach to take and the personality types I would experience from the interviewers I met with. Rayana's counsel was specifically accurate and I recommend her services without hesitation!",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "upchar",
    name: "Upchar",
    role: "Ayurvedic Massage Therapist",
    quote:
      "When I first met Rayana, being neighbours in one of the most beautiful coconut huts on a mountain ridge above the beach, she revealed herself as being a \"meat and potato psychic\"—really down to earth, into the world... but somehow not from it. We have become friends and at the same time she was my teacher. It is sheer wonderful, that both of it can work together – and maybe that is the most special thing I can say about Rayana: that her psychic abilities and clarity are impressive (you should try it out ;)) but even much greater is that immensely big heart of hers which can encompass every living being and feel and be with it, whatever the pain, whatever it needs... Thank you so much!!!",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "g-kuhlebrock",
    name: "G. Kuhlebrock",
    role: "Germany",
    quote:
      "I want to thank you for the really good workshop. You are a very good teacher, because you lead the group with love and safety, understanding and helping us individually, while at the same time guiding the group so that it remained undisturbed by our individual processes. I was familiar with the material you covered, but you showed me the context in a simple way so that suddenly I understood. With your concept, I am able to use and work with my energy field in a safe way that allows me to feel grounded at the same time.",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
  {
    slug: "d-van-dusen",
    name: "D. Van Dusen",
    role: "Assistant Accountant, Film",
    quote:
      "I have been a client of Rayana's for 15 years or so, and once I started with her, it became very difficult to be treated by anyone else. Rayana combines her professional skills with her ability to heal and comfort me just by her touch or simply by her presence, both of which I find to be calming. She is a professional, with a special gift for healing, and this is what makes her treatments and sessions truly unique. Many thanks Rayana!",
    excerpt: "",
    featured: true,
    showFullName: true,
  },
];

export const RAYANA_ABOUT_SECTIONS: TypedPageSection[] = [
  section("about-hero", "hero", 0, {
    eyebrow: "About Rayana",
    heading: "My Story",
    body: "<p>Clarity · Consciousness · Truth · Presence</p>",
    images: [SEED_IMAGES.portrait2],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("about-intro", "splitStory", 1, {
    heading: "A Deeper Way of Seeing What Matters",
    body: RAYANA_STORY_BODY,
    images: [SEED_IMAGES.portrait1],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("about-journey", "numberedSteps", 2, {
    eyebrow: "How I Work",
    heading: "See · Understand · Integrate",
    items: [
      { title: "See", body: "What is actually happening." },
      { title: "Understand", body: "What lies beneath the pattern." },
      {
        title: "Integrate",
        body: "How to move forward with greater truth, consciousness, and from a deeper presence.",
      },
    ],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("about-principles", "iconList", 3, {
    eyebrow: "My Philosophy",
    heading: "The Wisdom Heart",
    items: [
      {
        title: "Clarity",
        body: "Meeting life with greater clarity and seeing what we could not previously see about ourselves and our lives.",
        icon: "heart",
      },
      {
        title: "Consciousness",
        body: "Making choices from a place of greater consciousness, truth, and sovereignty.",
        icon: "orbit",
      },
      {
        title: "Presence",
        body: "Transforming uncertainty into understanding and wisdom, to be used daily.",
        icon: "flame",
      },
    ],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("about-teaching", "splitStory", 4, {
    heading: "Over 30 Years of Experience",
    body: "<p>Rayana offers her expertise with over 30 years of professional and international experience in private practice, and as an educator. Her work is not about telling us who we should be or giving us answers to live by. It is about helping us to \"see and feel and sense\" deeply so we can recognize what is true, understand what our experience is revealing, and make choices from a place of greater consciousness and sovereignty.</p>",
    images: [SEED_IMAGES.workshop],
    buttons: [btn("Work With Me", "/services", "secondary")],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("about-values", "iconList", 5, {
    heading: "What Brings You Here?",
    items: RAYANA_BRINGS_ITEMS.map((title) => ({ title, body: "" })),
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("about-behind", "galleryStrip", 6, {
    heading: "Behind the Work",
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("about-quote", "editorialQuote", 7, {
    heading: "When We Learn to See More Deeply",
    body: "<p>“When we learn to see more deeply, we understand ourselves more honestly. When we understand ourselves more honestly, we become free to live more consciously, and create the life we want.”</p>",
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("about-cta", "bookingCTA", 8, {
    heading: "Begin Where You Are",
    body: "<p>Centre yourself. Bring your questions. Allow space for what wants to be seen.</p>",
    buttons: [btn("Book a Session", "/booking")],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
];

export const RAYANA_FAQS: PublicFAQ[] = [
  {
    slug: "prepare-questions",
    question: "How should I prepare for a session?",
    answer:
      "Prepare your questions—try to aim for at least three. It helps to focus the energy for the reading and allows Rayana to see deeper into what is really going on. We can spend a moment at the beginning of the session sorting that out if you are unsure.",
    category: "Sessions",
  },
  {
    slug: "before-session",
    question: "What should I do before a session?",
    answer:
      "Allow for 10 minutes before a session to relax and centre your energy, and to collect your thoughts and feelings so the session has greater focused energy and the information can be accessed faster, easier and with increased clarity.",
    category: "Sessions",
  },
  {
    slug: "session-length",
    question: "How long is a session?",
    answer:
      "Sessions are 60 minutes, but it is good to put aside 90 minutes in the event that the session runs longer so we can conclude the information coming through.",
    category: "Sessions",
  },
  {
    slug: "record-session",
    question: "Can I record the session?",
    answer:
      "You are welcome to set up your own recording of the session on your side. You can also arrange after booking to have a recording of the session sent to you via your email by contacting rayanadesilva@heartmatters.com.",
    category: "Sessions",
  },
  {
    slug: "online-sessions",
    question: "Are phone and online sessions available?",
    answer:
      "Private consultations and wisdom mentoring are available via Zoom, FaceTime, phone, email, or in person where offered.",
    category: "Sessions",
  },
  {
    slug: "which-service",
    question: "How do I know which offering is right for me?",
    answer:
      "If you are unsure, begin with a private consultation. Rayana will help you discern the path that meets you where you are.",
    category: "General",
  },
];
