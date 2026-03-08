"use client";

import ImageViewer from "@/components/Overlay/ImageViewer";
import Overlay from "@/components/Overlay/Overlay";
import Experience from "@/components/Room/Experience";

export default function Home() {
  return (
    <main>
      <Experience />
      <Overlay />
      <ImageViewer />
    </main>
  );
}
