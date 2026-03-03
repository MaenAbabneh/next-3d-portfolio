"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import Experience from "@/components/Room/Experience";

export default function Home() {
  return (
    <main>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <Experience />
    </main>
  );
}
