import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function PullQuote({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) {
  return (
    <div className="my-10 relative pl-8 md:pl-12">
      <IoChatbubbleEllipsesOutline
        size={60}
        className="absolute -top-4 -left-2 text-base-blue/20 dark:text-base-blue-dark/30 -z-10 rotate-12"
      />
      <blockquote className="border-l-8 border-base-blue dark:border-base-blue-dark pl-6 py-2">
        <p className="font-serif font-black text-2xl md:text-3xl leading-tight text-base-brwan tracking-tighter">
          &quot;{children}&quot;
        </p>
        {author && (
          <footer className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-base-blue">
            — {author}
          </footer>
        )}
      </blockquote>
    </div>
  );
}
