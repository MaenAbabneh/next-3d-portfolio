"use client";

import dynamic from "next/dynamic";

import ImageViewer from "@/components/Overlay/ImageViewer";
import Overlay from "@/components/Overlay/Overlay";

const Experience = dynamic(() => import("@/components/Room/Experience"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-base-cream dark:bg-base-blue-light text-base-brwan flex items-center justify-center">
      Loading 3D...
    </div>
  ),
});

export default function Home() {
  return (
    <main>
      <Experience />
      <Overlay />
      <ImageViewer />
    </main>
  );
}
