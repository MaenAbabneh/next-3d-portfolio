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
  contentSource: string;
  toc: ArticleTocItem[];
};

const ARTICLE_1_SOURCE = `Three.js يسهّل استخدام WebGL بشكل عملي داخل الويب. الفكرة الأساسية: **مشهد (Scene)** يحتوي عناصر، **كاميرا (Camera)** تحدد منظورك، و**Renderer** يرسم النتيجة.

## Minimal mental model

- Scene: صندوق يجمع كل شيء
- Camera: العين
- Mesh: شكل + خامة
- Light: يغير الشكل والإحساس

## A tiny example

\`\`\`ts
// pseudo-code (concept only)
const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer();

const cube = new Mesh(geometry, material);
scene.add(cube);

function tick() {
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
\`\`\`

## Tips

> ابدأ بشيء بسيط (Cube + Light) ثم زد التفاصيل تدريجيًا.

- ثبّت الوحدات (meters) وقياس الإضاءة
- راقب الأداء: عدد المضلعات، الظلال، وحجم الخامات
- اجعل الكاميرا “مريحة” قبل أي تجميل`;

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

export const ARTICLES_CONTENT: ArticleBase[] = [
  {
    id: 1,
    title: "Understanding 3D rendering with Three.js",
    category: "Three.js",
    date: "Oct 24, 2025",
    updatedAt: "Mar 22, 2026",
    views: 128,
    excerpt: "A beginner's guide to creating immersive 3D web experiences...",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    contentSource: ARTICLE_1_SOURCE,
    toc: buildArticleToc(1, ARTICLE_1_SOURCE),
  },
  {
    id: 2,
    title: "Why GSAP is my favorite animation library",
    category: "Animation",
    date: "Nov 02, 2025",
    updatedAt: "Mar 10, 2026",
    views: 74,
    excerpt:
      "Exploring the power of GSAP for buttery smooth animations in React.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
    contentSource: ARTICLE_2_SOURCE,
    toc: buildArticleToc(2, ARTICLE_2_SOURCE),
  },
  {
    id: 3,
    title: "Building scalable Next.js applications",
    category: "Next.js",
    date: "Dec 15, 2025",
    updatedAt: "Feb 28, 2026",
    views: 205,
    excerpt: "Best practices for folder structure and state management.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    contentSource: ARTICLE_3_SOURCE,
    toc: buildArticleToc(3, ARTICLE_3_SOURCE),
  },
];
