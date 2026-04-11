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

const ARTICLE_2_SOURCE = `<RetroImage 
  src="https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775888098/article-2_n4bq2e.png" 
  alt="3D Wireframe and full geometry of an interactive menu side-by-side"
  caption="From wireframe to final render: building an immersive 3D universe."
/>

# Case Study: Interactive 3D Portfolio Universe

## Overview

This project is an immersive, high-performance 3D portfolio designed to showcase full-stack development and creative motion design skills. Moving away from traditional "flat" websites, this experience utilizes a fully interactive 3D room where users can explore projects and content in a gamified environment.

## The Challenge

The primary goal was to build a visually complex 3D interface that remains highly performant across all devices. The technical challenges involved:
- **Performance Optimization:** Maintaining a "locked 60fps" while rendering complex WebGL scenes.
- **Seamless Interactivity:** Integrating traditional web elements (like articles and links) within a 3D space.
- **Visual Storytelling:** Using motion to guide the user's attention without overwhelming the interface.

## Technical Solution

### 1. 3D Engine & Rendering
- **Framework:** Built with Next.js 16 and React 19 for robust server-side capabilities and modern rendering.
- **Scene Management:** Utilized \`@react-three/fiber\` and \`@react-three/drei\` to manage the 3D environment.
- **Optimization:** Implemented \`PerformanceMonitor\` to scale resolution dynamically and \`Bvh\` (Bounding Volume Hierarchy) to optimize raycasting and interaction speed.

### 2. Motion Design (GSAP Integration)
To ensure the movements felt "human" and fluid, GSAP was used to create precise timelines. GSAP is excellent when you need exact control over timing and sequences without the headache.

**Why I rely on GSAP for 3D UI:**
- **Clear Timelines:** You build a story for the motion rather than coding it line-by-line.
- **Natural Easing:** The movement feels human and tactile.
- **High Performance:** Excellent execution even with heavy 3D scenes.

Here is a simple timeline idea demonstrating this approach:

\`\`\`ts
// pseudo-code
const tl = gsap.timeline();

tl.to(".card", { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" })
  .to(".title", { x: 0, duration: 0.3 }, "-=0.2")
  .to(".shine", { opacity: 1, duration: 0.2 }, "-=0.1");
\`\`\`

<Tip title="Practical Animation Advice">
  - Don't try to compensate for a bad UI with heavy animations.
  - Let the movement serve a clear purpose: entry, confirmation, or transition.
  - Try to keep durations short (0.2–0.6s) for the best feel.
</Tip>

### 3. State & Audio
- **Global State:** Managed via \`Zustand\` to track user progress, game settings (SFX/BGM), and UI overlays.
- **Spatial Audio:** Integrated \`howler\` to provide immersive UI sounds and background music that enhances the 3D atmosphere.

## Results

- **High Performance:** Achieved stable frame rates through aggressive optimization and modern WebGL power-preference settings.
- **Engagement:** An interactive "Selected Works" section featuring projects like CreativeFlow and the GTA VI Landing Page.
- **Cross-Platform:** A fully responsive 3D camera system that adapts the viewing angle and controls for mobile vs. desktop users.

## Key Takeaways

GSAP is excellent for precise control over timing and sequences without the headache. The key is making movement serve a meaning—entry, confirmation, or transition.

---

**Want to build an immersive web experience?**
Check out the live demo at [macos.maenababneh.dev](https://macos.maenababneh.dev) or explore the code on [GitHub](https://github.com/MaenAbabneh). If you're interested in collaborating, feel free to reach out at [hi@maenababneh.dev](mailto:hi@maenababneh.dev).`;

const ARTICLE_3_SOURCE = `لما يكبر المشروع، أكثر شيء ينهكك هو “المسارات” غير الواضحة وملفات تتضخم.

## Principles that scale

- افصل **UI** عن **feature logic**
- خفّف الـ props drilling: استخدم store أو context حسب الحاجة
- خلي البيانات (data) قريبة من المكان اللي تُعرض فيه

## Folder approach (one simple option)

- \`components/\` لقطع UI العامة
- \`hooks/\` للـ hooks المشتركة
- \`store/\` للحالة العالمية
- \`constant/\` للبيانات الثابتة

## Don’t over-engineer

> التنظيم مهم… لكن لا تبني إطار داخلي قبل ما تحتاجه.

ابدأ بسيط، وبعدها لما تلاحظ التكرار، اعمل abstraction صغيرة وواضحة.`;

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
    title: "Case Study: Interactive 3D Portfolio Universe", // 🌟 العنوان الجديد
    category: "Case Study", // 🌟 الفئة الجديدة
    date: "Nov 02, 2025",
    updatedAt: "Mar 10, 2026",
    views: 0,
    excerpt:
      "An in-depth look at building a high-performance, interactive 3D portfolio using Next.js, Three.js, and GSAP.",
    image:
      "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775888512/article-2-content_mccdfu.png",
    imageAlt:
      "Abstract motion design scene representing GSAP animation workflows in a modern React project.",
    contentSource: ARTICLE_2_SOURCE + END_MARKER,
    toc: buildArticleToc(2, ARTICLE_2_SOURCE),
  },
  {
    id: 3,
    title: "Building scalable Next.js applications",
    category: "Next.js",
    date: "Dec 15, 2025",
    updatedAt: "Feb 28, 2026",
    views: 0,
    excerpt: "Best practices for folder structure and state management.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    imageAlt:
      "Clean workspace and code layout illustrating scalable Next.js application structure and state management.",
    contentSource: ARTICLE_3_SOURCE + END_MARKER,
    toc: buildArticleToc(3, ARTICLE_3_SOURCE),
  },
];
