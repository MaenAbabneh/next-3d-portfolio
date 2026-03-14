"use client";

import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiExternalLink } from "react-icons/fi";

const projects = [
  {
    title: "GTA VI Clone",
    description: "Immersive 3D experience with high-fidelity graphics.",
    tags: ["Next.js", "Three.js", "WebGL"],
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    demo: "#",
    repo: "https://github.com/MaenAbabneh",
  },
  {
    title: "Amazon Scraper",
    description: "Scalable API for parsing product data & proxies.",
    tags: ["Node.js", "Puppeteer", "Redis"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    demo: "#",
    repo: "https://github.com/MaenAbabneh",
  },
  {
    title: "Creative Overflow",
    description: "Dev Q&A platform with real-time reputation system.",
    tags: ["React", "Prisma", "Socket.io"],
    image:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
    demo: "#",
    repo: "https://github.com/MaenAbabneh",
  },
];

export default function WorksSection() {
  return (
    // 1. الحاوية الرئيسية تأخذ الطول الكامل
    <div className="flex flex-col h-full w-full">
      {/* Header: ثابت في الأعلى */}
      <div className="flex flex-col items-start space-y-1 mb-4 shrink-0">
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-base-blue-dark dark:text-base-cream">
          Selected Works
        </h2>
        <p className="text-base-brwan dark:text-base-cream/80 opacity-90 text-sm">
          Technical depth from 3D worlds to backend architectures.
        </p>
      </div>

      {/* 2. حاوية البطاقات:
         - flex-1: تأخذ كل المساحة المتبقية من الطول
         - items-stretch: تجعل البطاقات بنفس الطول تماماً
         - gap-4: مسافة بسيطة بين البطاقات
      */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 w-full min-h-0">
        {projects.map((project, index) => (
          <div
            key={index}
            className="
              group relative flex flex-col 
              flex-1 
              rounded-2xl overflow-hidden 
              bg-white dark:bg-base-blue-light/50 
              shadow-lg hover:shadow-2xl 
              transition-all duration-300
              /* تم إزالة البوردر من هنا */
            "
          >
            {/* قسم الصورة:
               يأخذ نسبة أكبر من البطاقة (مثلاً 55% أو flex-grow)
            */}
            <div className="relative h-[55%] w-full overflow-hidden bg-gray-200">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* أيقونات الروابط تظهر عند التحويم */}
              <div className="absolute inset-0 bg-base-blue-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <Link
                  href={project.repo}
                  target="_blank"
                  className="p-3 bg-base-cream rounded-full text-base-blue-dark hover:scale-110 transition-transform shadow-md"
                >
                  <FiGithub size={22} />
                </Link>
                <Link
                  href={project.demo}
                  target="_blank"
                  className="p-3 bg-base-yellow rounded-full text-base-blue-dark hover:scale-110 transition-transform shadow-md"
                >
                  <FiExternalLink size={22} />
                </Link>
              </div>
            </div>

            {/* قسم النصوص: يملأ باقي المساحة */}
            <div className="flex flex-col flex-1 p-4 md:p-5 gap-2 bg-white/50 dark:bg-transparent">
              <h3 className="text-lg md:text-xl font-bold text-base-blue-dark dark:text-base-cream font-serif">
                {project.title}
              </h3>

              <p className="text-sm text-base-brwan dark:text-base-cream/80 leading-relaxed line-clamp-3 md:line-clamp-none">
                {project.description}
              </p>

              {/* Tags في الأسفل */}
              <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[11px] font-semibold rounded-md bg-base-blue/10 dark:bg-base-yellow/10 text-base-blue-dark dark:text-base-yellow"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
