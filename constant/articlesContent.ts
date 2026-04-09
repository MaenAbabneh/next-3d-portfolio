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

const ARTICLE_2_SOURCE = `GSAP ممتاز عندما تبغى تحكم “دقيق” بالتوقيت، السلاسة، والتسلسل (timelines) بدون صداع.

## What I like about it

- Timeline واضح: تبني قصة للحركة بدل سطر-سطر
- Ease طبيعي: الحركة تحسّها بشرية
- أداء ممتاز حتى مع مشاهد ثقيلة

## A simple timeline idea

\`\`\`ts
// pseudo-code
const tl = gsap.timeline();

tl.to(".card", { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" })
  .to(".title", { x: 0, duration: 0.3 }, "-=0.2")
  .to(".shine", { opacity: 1, duration: 0.2 }, "-=0.1");
\`\`\`

## Practical advice

- لا تحاول تعوّض UI كامل بـ animations
- خلي الحركة تخدم المعنى: دخول، تأكيد، انتقال…
- جرّب تبقي durations قصيرة (0.2–0.6) غالبًا أفضل`;

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
    title: "Why GSAP is my favorite animation library",
    category: "Animation",
    date: "Nov 02, 2025",
    updatedAt: "Mar 10, 2026",
    views: 0,
    excerpt:
      "Exploring the power of GSAP for buttery smooth animations in React.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
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
