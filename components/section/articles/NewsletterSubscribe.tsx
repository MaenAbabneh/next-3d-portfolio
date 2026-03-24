"use client";

import { useId, useMemo, useState } from "react";

const TAGLINES = [
  "Keep your ideals high. The sky belongs to no one. ✨",
  "Small steps every day beat perfect plans.",
  "Build boldly, learn quickly, ship kindly.",
  "Design with intention, code with clarity.",
  "Curiosity is the best career compass.",
] as const;

type NewsletterSubscribeProps = {
  className?: string;
};

export default function NewsletterSubscribe({
  className,
}: NewsletterSubscribeProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "success" | "invalid"
  >("idle");

  const stableId = useId();
  const tagline = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < stableId.length; i += 1) {
      hash = (hash * 31 + stableId.charCodeAt(i)) >>> 0;
    }
    return TAGLINES[hash % TAGLINES.length];
  }, [stableId]);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = newsletterEmail.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setNewsletterStatus("invalid");
      return;
    }

    try {
      window.localStorage.setItem("portfolio:newsletterEmail", email);
      window.localStorage.setItem(
        "portfolio:newsletterSubscribedAt",
        new Date().toISOString(),
      );
    } catch {
      // ignore storage errors (private mode, etc.)
    }

    setNewsletterStatus("success");
  };

  return (
    <div
      className={
        className ??
        "rounded-2xl border-4 border-base-blue/20 bg-white/40 dark:bg-white/5 p-5"
      }
    >
      <div className="mb-4">
        <p className="text-base-blue dark:text-base-blue-dark font-black leading-tight text-xl">
          <span className="block">Maen W Ababneh</span>
        </p>
        <p className="mt-2 text-base font-bold text-base-blue/70 dark:text-base-blue-dark/70">
          {tagline}
        </p>
      </div>

      <p className="text-base-brwan dark:text-base-brwan text-sm font-bold leading-relaxed">
        <span className="block">Want to know when I publish new content?</span>
        <span className="block">
          Enter your email to join my free newsletter:
        </span>
      </p>

      <form
        onSubmit={handleNewsletterSubmit}
        className="mt-4 flex flex-col gap-3"
      >
        <input
          value={newsletterEmail}
          onChange={(e) => {
            setNewsletterEmail(e.target.value);
            if (newsletterStatus !== "idle") {
              setNewsletterStatus("idle");
            }
          }}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full md:w-2/3 rounded-xl border-4 border-base-blue dark:border-base-blue-dark bg-white/70 dark:bg-base-blue-light/10 px-4 py-3 font-mono font-black tracking-wide text-base-brwan placeholder:text-base-brwan/50 focus:outline-none"
          aria-label="Email address"
        />

        <button
          type="submit"
          className="self-start rounded-xl border-4 border-base-blue dark:border-base-blue-dark bg-white/70 dark:bg-base-blue-light/10 px-4 py-3 font-black text-base-blue dark:text-base-blue-dark hover:scale-[1.02] transition-transform"
        >
          Subscribe
        </button>
      </form>

      {newsletterStatus === "invalid" ? (
        <p className="mt-3 text-sm font-bold text-base-brwan/80 dark:text-base-cream/80">
          بريد غير صالح—تأكد من كتابة الإيميل بشكل صحيح.
        </p>
      ) : null}
      {newsletterStatus === "success" ? (
        <p className="mt-3 text-sm font-bold text-base-brwan/80 dark:text-base-cream/80">
          تم الاشتراك! شكرًا لك.
        </p>
      ) : null}
    </div>
  );
}
