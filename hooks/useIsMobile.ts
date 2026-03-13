"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  // الحالة الافتراضية false (لتجنب أخطاء Next.js SSR)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // دالة فحص حجم الشاشة
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // تشغيل الفحص فوراً عند فتح الموقع
    handleResize();

    // الاستماع لأي تغيير في حجم النافذة (مثل تدوير الجوال)
    window.addEventListener("resize", handleResize);

    // تنظيف الحدث عند إغلاق المكون (Best Practice)
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
