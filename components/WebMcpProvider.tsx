"use client";

import { useEffect } from "react";

import { ARTICLES_CONTENT } from "@/constant/articlesContent";
import { projects } from "@/constant/projects";
import { getArticleSlug } from "@/utils/articleSlug";

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: unknown) => unknown | Promise<unknown>;
};

type ModelContextApi = {
  registerTool?: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void;
  provideContext?: (context: {
    tools: Array<{
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute: (input: unknown) => unknown | Promise<unknown>;
    }>;
  }) => void;
};

const SITE_URL = "https://maenababneh.dev";

export default function WebMcpProvider() {
  useEffect(() => {
    const nav = navigator as Navigator & { modelContext?: ModelContextApi };
    const api = nav.modelContext;

    if (!api?.registerTool && !api?.provideContext) {
      return;
    }

    const controller = new AbortController();

    const tools: WebMcpTool[] = [
      {
        name: "get_featured_projects",
        description:
          "Return featured projects from the portfolio with repository and demo URLs.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: () => ({
          projects: projects.map((project) => ({
            title: project.title,
            description: project.description,
            repo: project.repo,
            demo: project.demo,
          })),
        }),
      },
      {
        name: "list_articles",
        description:
          "List published articles with title, category, date, and canonical URL.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: () => ({
          articles: ARTICLES_CONTENT.map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            date: article.date,
            url: `${SITE_URL}/articles/${getArticleSlug(article)}`,
          })),
        }),
      },
      {
        name: "get_contact_links",
        description: "Return primary contact channels for the site owner.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: () => ({
          email: "hi@maenababneh.dev",
          github: "https://github.com/MaenAbabneh",
          linkedin: "https://www.linkedin.com/in/maenababneh/",
          instagram: "https://www.instagram.com/maenababneh/",
        }),
      },
    ];

    if (api.registerTool) {
      for (const tool of tools) {
        api.registerTool(tool, { signal: controller.signal });
      }
    }

    if (api.provideContext) {
      api.provideContext({ tools });
    }

    return () => {
      controller.abort();
    };
  }, []);

  return null;
}
