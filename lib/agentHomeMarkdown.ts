import { ARTICLES_CONTENT } from "@/constant/articlesContent";
import { projects } from "@/constant/projects";
import { getArticleSlug } from "@/utils/articleSlug";

const SITE_URL = "https://maenababneh.dev";

export function buildHomeMarkdown(): string {
  const projectLines = projects
    .map(
      (project) =>
        `- ${project.title}: ${project.description}\n  - Repo: ${project.repo}\n  - Demo: ${project.demo}`
    )
    .join("\n");

  const articleLines = ARTICLES_CONTENT.map(
    (article) =>
      `- [${article.title}](${SITE_URL}/articles/${getArticleSlug(article)})`
  ).join("\n");

  return [
    "# Maen Ababneh - Interactive 3D Portfolio",
    "",
    "Full-stack developer portfolio featuring Next.js projects, GSAP motion work, and interactive web experiences.",
    "",
    "بورتفوليو تفاعلي ثلاثي الأبعاد لمعن عبابنة، مطور ويب متكامل يقدم مشاريع حديثة باستخدام Next.js وReact وGSAP.",
    "",
    "## About",
    "",
    "I am a software engineer who blends technical depth with creative design to build fast, interactive web products.",
    "",
    "أنا معن عبابنة، مهندس برمجيات أدمج بين العمق التقني والتصميم الإبداعي لبناء منتجات ويب سريعة وتفاعلية.",
    "",
    "## Selected Works",
    "",
    projectLines,
    "",
    "## Contact",
    "",
    "- Email: [hi@maenababneh.dev](mailto:hi@maenababneh.dev)",
    "- GitHub: [MaenAbabneh](https://github.com/MaenAbabneh)",
    "- LinkedIn: [linkedin.com/in/maenababneh](https://www.linkedin.com/in/maenababneh/)",
    "- Instagram: [instagram.com/maenababneh](https://www.instagram.com/maenababneh/)",
    "",
    "## Featured Articles",
    "",
    articleLines,
    "",
  ].join("\n");
}

export function estimateMarkdownTokens(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words * 1.33);
}
