import Link from "next/link";
import { IoLinkOutline, IoArrowForward } from "react-icons/io5";

export default function ResourceLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block my-6"
    >
      <div className="relative flex items-center justify-between p-5 bg-white dark:bg-base-dark-BG rounded-xl border-4 border-base-brwan/20 hover:border-base-blue transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[6px_6px_0px_0px_rgba(41,82,155,0.4)] group-hover:-translate-y-1">
        {/* تصميم قطع التذكرة الجانبي */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 size-5 bg-white dark:bg-base-dark-BG border-r-4 border-base-brwan/20 group-hover:border-base-blue rounded-full"></div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 size-5 bg-white dark:bg-base-dark-BG border-l-4 border-base-brwan/20 group-hover:border-base-blue rounded-full"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="bg-base-blue/10 p-3 rounded-lg text-base-blue">
            <IoLinkOutline
              size={24}
              className="group-hover:rotate-45 transition-transform"
            />
          </div>
          <div>
            <h4 className="font-black font-sans text-lg text-base-brwan group-hover:text-base-blue transition-colors">
              {title}
            </h4>
            {description && (
              <p className="text-xs font-mono text-base-brwan/70 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <IoArrowForward
          size={20}
          className="text-base-brwan/40 group-hover:text-base-blue group-hover:translate-x-1 transition-all z-10"
        />
      </div>
    </Link>
  );
}
