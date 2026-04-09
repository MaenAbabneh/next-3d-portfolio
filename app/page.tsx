import Link from "next/link";

import HomeClient from "@/components/home/HomeClient";
import { ARTICLES_CONTENT } from "@/constant/articlesContent";
import { projects } from "@/constant/projects";
import { getArticleSlug } from "@/utils/articleSlug";

export default function Home() {
  return (
    <main>
      <section className="sr-only" aria-label="Portfolio indexable content">
        <h1>Maen Ababneh - Interactive 3D Portfolio</h1>
        <p>
          Full-stack developer portfolio featuring Next.js projects, GSAP motion
          work, and interactive web experiences.
        </p>
        <p>
          بورتفوليو تفاعلي ثلاثي الأبعاد لمعن عبابنة، مطور ويب متكامل يقدم
          مشاريع حديثة باستخدام Next.js وReact وGSAP.
        </p>

        <h2>About Me</h2>
        <p>
          I am a software engineer who blends technical depth with creative
          design to build fast, interactive web products.
        </p>
        <p>
          أنا معن عبابنة، مهندس برمجيات أدمج بين العمق التقني والتصميم الإبداعي
          لبناء منتجات ويب سريعة وتفاعلية.
        </p>

        <h2>Selected Works</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>
                Repository: <Link href={project.repo}>{project.repo}</Link>
              </p>
              <p>
                Live Demo: <Link href={project.demo}>{project.demo}</Link>
              </p>
            </li>
          ))}
        </ul>

        <h2>Contact</h2>
        <ul>
          <li>
            Email:{" "}
            <Link href="mailto:hi@maenababneh.dev">hi@maenababneh.dev</Link>
          </li>
          <li>
            GitHub:{" "}
            <Link href="https://github.com/MaenAbabneh">MaenAbabneh</Link>
          </li>
          <li>
            LinkedIn:{" "}
            <Link href="https://www.linkedin.com/in/maenababneh/">
              linkedin.com/in/maenababneh
            </Link>
          </li>
          <li>
            Instagram:{" "}
            <Link href="https://www.instagram.com/maenababneh/">
              instagram.com/maenababneh
            </Link>
          </li>
        </ul>

        <h2>Featured Articles</h2>
        <ul>
          {ARTICLES_CONTENT.map((article) => (
            <li key={article.id}>
              <Link href={`/articles/${getArticleSlug(article)}`}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <HomeClient />
    </main>
  );
}
