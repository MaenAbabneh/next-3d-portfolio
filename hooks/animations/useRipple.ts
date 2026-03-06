import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface UseRippleProps {
  containerRef: React.RefObject<HTMLElement | null>;
  rippleRef: React.RefObject<HTMLElement | null>;
  isDark: boolean; // أو isActive
  colors: {
    darkBg: string;
    lightBg: string;
    darkBorder: string;
    lightBorder: string;
  };
}

export function useRipple({
  containerRef,
  rippleRef,
  isDark,
  colors,
}: UseRippleProps) {
  // حفظ إحداثيات النقر
  const clickPos = useRef({ x: 0, y: 0 });
  const isClickInteraction = useRef(false);
  const hasInitialized = useRef(false);

  // دالة تُربط بحدث onClick
  const registerClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    clickPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isClickInteraction.current = true;
  };

  useGSAP(() => {
    const container = containerRef.current;
    const ripple = rippleRef.current;
    if (!container || !ripple) return;

    // تحديد الألوان المستهدفة
    const targetBg = isDark ? colors.darkBg : colors.lightBg;
    const targetBorder = isDark ? colors.darkBorder : colors.lightBorder;

    // 1. الإعداد الأولي (لمنع الانيميشن عند تحميل الصفحة)
    if (!hasInitialized.current) {
      gsap.set(container, {
        backgroundColor: targetBg,
        borderColor: targetBorder,
      });
      gsap.set(ripple, { opacity: 0 });
      hasInitialized.current = true;
      return;
    }

    const tl = gsap.timeline();

    // تحديد نقطة الانطلاق (مكان النقر أو المنتصف)
    const startX = isClickInteraction.current
      ? clickPos.current.x
      : container.offsetWidth / 2;
    const startY = isClickInteraction.current
      ? clickPos.current.y
      : container.offsetHeight / 2;

    // 2. تجهيز الدائرة
    tl.set(ripple, {
      left: startX,
      top: startY,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 1,
      backgroundColor: targetBg, // الدائرة تأخذ لون الثيم الجديد
    });

    // 3. تكبير الدائرة
    tl.to(ripple, {
      scale: 45, // رقم كبير لضمان التغطية
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        // بعد الامتلاء، نثبت لون الخلفية ونخفي الدائرة
        gsap.set(container, { backgroundColor: targetBg });
        gsap.set(ripple, { opacity: 0 });
        isClickInteraction.current = false;
      },
    });

    // 4. تغيير البوردر بالتزامن
    tl.to(container, { borderColor: targetBorder, duration: 0.3 }, "<0.1");
  }, [isDark]); // يعيد التشغيل عند تغير الثيم

  return { registerClick };
}
