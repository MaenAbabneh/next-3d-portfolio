"use client";

import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { PiGithubLogoFill } from "react-icons/pi";
import { projects } from "@/constant/projects";

export default function WorksSection() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* هيدر القسم - flex vertical */}
      <div className="flex flex-col items-start space-y-1 mb-5 md:mb-6 shrink-0 pl-1">
        <h2 className="text-xl md:text-3xl font-bold font-serif text-base-blue dark:text-base-blue-dark">
          Selected Works
        </h2>
        <p className="text-base-brwan opacity-90 text-[13px] md:text-sm">
          Technical depth from 3D worlds to backend architectures.
        </p>
      </div>

      {/* حاوية المشاريع: flex vertical على الهاتف، grid على الديسكتوب */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-x-4 gap-y-5 md:gap-y-0 w-full pb-4">
        {projects.map((project, index) => (
          <div
            key={index}
            /* البطاقة: flex-col على الهاتف لترتيب الصورة فوق النصوص، subgrid على الديسكتوب */
            className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-white dark:bg-base-blue-light/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:grid md:grid-rows-subgrid md:row-span-4 min-h-0 md:mb-8"
          >
            {/* Image Section */}
            <div
              className="relative overflow-hidden bg-gray-200 shrink-0
                            w-full h-40 md:h-60"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 md:group-hover:scale-110" // disable hover scaling on mobile
              />
              {/* 🌟 تعديل: إخفاء أزرار الجوانب (hover) على الهاتف، وتصغير حجمها على الديسكتوب */}
              <div className="absolute inset-0 bg-base-blue-dark/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <Link
                  href={project.repo}
                  target="_blank"
                  className="p-2 bg-base-cream rounded-full text-base-blue dark:text-base-blue-dark hover:scale-110 transition-transform shadow-md"
                >
                  <PiGithubLogoFill className="w-5 h-5" />
                </Link>
                <Link
                  href={project.demo}
                  target="_blank"
                  className="p-2 bg-base-yellow rounded-full text-base-cream hover:scale-110 transition-transform shadow-md"
                >
                  <FiExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Container for Texts - flex vertical للهاتف، md:contents للديسكتوب */}
            <div className="flex flex-col flex-1 px-3 pt-3 pb-3 md:contents">
              {/* العنوان: flex child 1 للهاتف */}
              <h3 className="text-[15px] md:text-xl font-bold text-base-blue dark:text-base-blue-dark font-serif self-start md:px-5 md:pt-5 md:pb-1 mb-1 md:mb-0">
                {project.title}
              </h3>

              {/* 🌟 تعديل: إزالة line-clamp-3 للهاتف ليظهر الوصف كاملاً */}
              {/* الوصف: flex child 2 للهاتف */}
              <p className="text-[12px] md:text-sm text-base-brwan leading-relaxed self-start md:px-5 md:pb-4 mb-2 md:mb-0">
                {project.description}
              </p>

              {/* 🌟 إضافة: مصفوفة أزرار مخصصة تظهر فقط على الهاتف */}
              {/* حاوية الأزرار: flex item للهاتف، hidden على الديسكتوب */}
              <div className="flex md:hidden flex-row gap-2 mt-2 mb-2 w-full text-base-blue dark:text-base-blue-dark">
                <Link
                  href={project.repo}
                  target="_blank"
                  className="flex flex-row items-center gap-1.5 px-3 py-1 rounded-md text-[10px] shadow-sm"
                >
                  <PiGithubLogoFill className="w-4 h-4" />
                  GitHub
                </Link>
                <Link
                  href={project.demo}
                  target="_blank"
                  className="flex flex-row items-center gap-1.5 px-3 py-1 rounded-md text-[10px] shadow-sm"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
              </div>

              {/* التاجز: flex vertical item 3, mt-auto للهاتف */}
              <div className="self-end flex flex-wrap gap-1 md:gap-1.5 md:px-5 md:pb-5 mt-auto md:mt-0 pt-2 md:pt-0 border-t border-dashed border-base-brwan/20 md:border-none w-full md:w-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-[9px] md:text-[11px] font-semibold rounded-sm md:rounded-md bg-base-blue/10 dark:bg-base-blue-dark/10 text-base-blue dark:text-base-blue-dark"
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
