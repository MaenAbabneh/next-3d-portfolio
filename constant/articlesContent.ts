import { slugifyHeading } from "@/utils/slugifyHeading";

export type ArticleTocItem = { id: string; label: string; depth: 2 | 3 };

export type ArticleBase = {
  id: number;
  title: string;
  category: string;
  date: string;
  updatedAt: string;
  views: number;
  excerpt: string;
  image?: string;
  imageAlt: string;
  imageObjectPosition?: string;
  contentSource: string;
  toc: ArticleTocItem[];
};

const ARTICLE_1_SOURCE = `I’m Maen Ababneh, a Full-Stack Web Developer and Computer Science student from Jordan on a mission to end the era of boring web experiences. My journey started with an obsessive question: *How can a few lines of code make a pixel dance on a screen?*

## From 'Does it work?' to 'Does it feel right?'

Today, I don't just build websites that "work"—I build experiences that feel alive. I specialize in bridging the gap between solid, high-performance systems and the magical world of **GSAP** and **3D** animations.

## The Tech Stack: Choosing Tools That Scale

Performance shouldn't come at the cost of delight. My tech stack is a carefully curated toolbox:

- **Next.js & React:** My foundation for lightning-fast Server Actions and SEO.
- **GSAP (GreenSock):** Where the magic happens. I use it to make digital interactions feel natural and tactile.
- **Three.js & WebGL:** For when 2D isn't enough. I love pushing the boundaries of the browser.
- **Tailwind CSS:** For clean, responsive, and maintainable styling.

## Beyond the Code

When I'm not pushing pixels or optimizing database queries for projects like **CreativeFlow**, you'll probably find me defending towers in *Kingdom Rush* or trying to recreate the *GTA VI* landing page just for the challenge.

---
`;

const ARTICLE_2_SOURCE = `
<RetroImage 
  src="https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775888098/article-2_n4bq2e.png" 
  alt="3D Wireframe and full geometry of an interactive menu side-by-side"
  caption="From wireframe to final render: building an immersive 3D universe."
/>

# Case Study: Interactive 3D Portfolio Universe

## Overview

This project is an immersive, high-performance 3D portfolio designed to showcase full-stack development and creative motion design skills. Instead of a traditional "flat" website, it uses a fully interactive 3D room where visitors can explore projects and content in a gamified environment.

## The Challenge

The main challenge was building a visually rich 3D interface that still feels fast on every device. The technical work focused on:

- **Performance Optimization:** Maintaining a "locked 60fps" while rendering complex WebGL scenes.
- **Seamless Interactivity:** Integrating traditional web elements (like articles and links) within a 3D space.
- **Visual Storytelling:** Using motion to guide the user's attention without overwhelming the interface.

## Technical Solution

### 1. 3D Engine & Rendering

- **Framework:** Built with Next.js 16 and React 19 for robust server-side capabilities and modern rendering.
- **Scene Management:** Utilized \`@react-three/fiber\` and \`@react-three/drei\` to manage the 3D environment.
- **Optimization:** Implemented \`PerformanceMonitor\` to scale resolution dynamically and \`Bvh\` (Bounding Volume Hierarchy) to optimize raycasting and interaction speed.

### 2. Motion Design (GSAP Integration)

To keep the motion feeling human and fluid, GSAP was used to create precise timelines. It gives exact control over timing and sequencing without turning the code into a mess.

**Why I rely on GSAP for 3D UI:**

- **Clear Timelines:** You build a story for the motion rather than coding it line-by-line.
- **Natural Easing:** The movement feels human and tactile.
- **High Performance:** Excellent execution even with heavy 3D scenes.

Here is a simple timeline idea demonstrating the approach:

\`\`\`ts
// pseudo-code
const tl = gsap.timeline();

tl.to(".card", { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" })
  .to(".title", { x: 0, duration: 0.3 }, "-=0.2")
  .to(".shine", { opacity: 1, duration: 0.2 }, "-=0.1");
\`\`\`

<Tip title="Practical Animation Advice">

Don't try to compensate for a bad UI with heavy animations.

Let the movement serve a clear purpose: entry, confirmation, or transition.

Try to keep durations short (0.2-0.6s) for the best feel.
</Tip>

### 3. State & Audio

- **Global State:** Managed via \`Zustand\` to track user progress, game settings (SFX/BGM), and UI overlays.
- **Spatial Audio:** Integrated \`howler\` to provide immersive UI sounds and background music that enhances the 3D atmosphere.

## Results

- **High Performance:** Achieved stable frame rates through aggressive optimization and modern WebGL power-preference settings.
- **Engagement:** An interactive "Selected Works" section featuring projects like CreativeFlow and the GTA VI Landing Page.
- **Cross-Platform:** A fully responsive 3D camera system that adapts the viewing angle and controls for mobile vs. desktop users.

## Key Takeaways

GSAP is excellent for precise control over timing and sequences without the headache. The key is making movement serve a meaning: entry, confirmation, or transition.

---

**Want to build an immersive web experience?**
Check out the live demo at [macos.maenababneh.dev](https://macos.maenababneh.dev) or explore the code on [GitHub](https://github.com/MaenAbabneh). If you're interested in collaborating, feel free to reach out at [hi@maenababneh.dev](mailto:hi@maenababneh.dev).`;

const ARTICLE_3_SOURCE = `Growth is a double-edged sword. In Next.js, it often starts with a single file and ends with a spaghetti of state and props. The real fatigue is not the code itself, it is the friction of not knowing where logic belongs.

## Why this matters in real projects

If you care about **Next.js App Router Architecture**, **Clean Code in React**, and long-term maintainability, you need one thing first: clear boundaries.

<Note title="Practical rule">
I do not build a new abstraction unless I see real repetition or a clear change point.
</Note>

## Three rules that scale

- I enforce **Separation of Concerns**: UI and feature logic should not grow into each other.
- I reduce props drilling by using context or a store only when it truly helps.
- I keep data close to where it is rendered, unless multiple features depend on it.

## Folder approach (functional view)

This is the **Scalable Folder Structure** I keep coming back to in medium and large Next.js projects:

- \`components/\`: The visual primitives. Keep them dumb and fast.
- \`hooks/\`: The brain of the UI. Where state meets behavior.
- \`lib/\`: The silent workers. Pure functions and external clients.
- \`store/\`: Shared state for cross-screen workflows.
- \`constant/\`: Static data and config-like values.

<StatsTable
  title="Folder Map"
  stats={[
    { label: "UI", value: "components/" },
    { label: "State", value: "store/" },
    { label: "Shared Logic", value: "hooks/" },
    { label: "Data", value: "constant/" },
  ]}
/>

## The anti-pattern

The fastest way to lose control is mixing API calls, view state, and domain logic directly inside UI components. It works in week one, then slows everything down in month three.

<PullQuote author="Hard-earned lesson">
If every component talks directly to APIs, your UI becomes your backend contract.
</PullQuote>

## The Rule of Three

<Tip title="The Rule of Three">

If the same pattern repeats three times, that is my signal to create a small, explicit abstraction.

Before that, I keep things simple and local.

</Tip>

## Context vs store (Zustand)

Use React Context for low-frequency shared values like theme, locale, or auth metadata.

Use Zustand when state updates are frequent, multi-screen, or interaction-heavy. It usually gives cleaner selectors and helps avoid broad re-renders in complex interfaces.

## Example checklist

- Is this logic specific to one feature? I keep it close to that feature.
- Is this code used in more than one place? I move it to \`lib/\` or \`hooks/\`.
- Does this state affect more than one screen? I put it in \`store/\`.
- If I replace this UI library tomorrow, how much logic will I have to rewrite?

<ResourceLink
  href="https://nextjs.org/docs/app"
  title="Next.js App Router Documentation"
  description="A practical reference for structuring pages, layouts, and server components cleanly."
/>

Stop fighting your folder structure and start building features.

If you want help reviewing your architecture or planning a scalable Next.js setup, feel free to reach out at [hi@maenababneh.dev](mailto:hi@maenababneh.dev).`;

function buildArticleToc(
  articleId: number,
  contentSource: string,
): ArticleTocItem[] {
  const items: ArticleTocItem[] = [];
  const lines = contentSource.split("\n");

  for (const line of lines) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const depth = match[1] === "###" ? (3 as const) : (2 as const);
    const label = match[2].trim();
    if (!label) continue;

    const slug = slugifyHeading(label) ?? "section";
    const id = `article-${articleId}-${slug}`;
    items.push({ id, label, depth });
  }

  return items;
}

const END_MARKER = `\n\n---\n\n<div id="article-end-marker" className="h-1 w-full" />`;

export const ARTICLES_CONTENT: ArticleBase[] = [
  {
    id: 1,
    title: "Who is Maen Ababneh? | A Full-Stack Dev on a Mission",
    category: "Personal",
    date: "May 15, 2024",
    updatedAt: "May 15, 2024",
    views: 0,
    excerpt:
      "Meet Maen Ababneh, a Full-Stack Web Developer specializing in high-performance, interactive experiences with Next.js and GSAP.",
    image:
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1775045145/wmremove-transformed_qbfbum.png",
    imageAlt:
      "Portrait of Maen Ababneh, a full-stack web developer focused on interactive Next.js and GSAP experiences.",
    imageObjectPosition: "50% 30%",
    contentSource: ARTICLE_1_SOURCE + END_MARKER,
    toc: buildArticleToc(1, ARTICLE_1_SOURCE),
  },
  {
    id: 2,
    title: "Case Study: Interactive 3D Portfolio Universe",
    category: "Case Study",
    date: "Nov 02, 2025",
    updatedAt: "Mar 10, 2026",
    views: 0,
    excerpt:
      "A focused breakdown of building a high-performance interactive 3D portfolio with Next.js, Three.js, GSAP, and immersive spatial audio.",
    image:
      "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775888512/article-2-content_mccdfu.png",
    imageAlt:
      "Interactive 3D portfolio scene showing motion design, spatial UI, and performance-focused rendering.",
    contentSource: ARTICLE_2_SOURCE + END_MARKER,
    toc: buildArticleToc(2, ARTICLE_2_SOURCE),
  },
  {
    id: 3,
    title: "Scaling Next.js Apps: The Architecture That Saved My Sanity",
    category: "Next.js",
    date: "Dec 15, 2025",
    updatedAt: "Feb 28, 2026",
    views: 0,
    excerpt:
      "A personal guide to scalable Next.js architecture with three practical rules for clean structure, clearer boundaries, and faster feature delivery. Stop fighting your folder structure and start building features.",
    image:
      "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775898974/article-3_1_dn0kbm.png",
    imageAlt:
      "Clean workspace and code layout illustrating scalable Next.js application structure and state management.",
    contentSource: ARTICLE_3_SOURCE + END_MARKER,
    toc: buildArticleToc(3, ARTICLE_3_SOURCE),
  },
];
