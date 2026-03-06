import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, RefObject } from "react";

interface UseRippleProps {
  containerRef: RefObject<HTMLElement | null>;
  rippleRef: RefObject<HTMLElement | null>;
  isDark: boolean;
  colors: {
    darkBg: string;
    lightBg: string;
    darkBorder: string;
    lightBorder: string;
  };
  borderWidth?: number; // مهم جداً لتصحيح الإزاحة
}

export function useRipple({
  containerRef,
  rippleRef,
  isDark,
  colors,
  borderWidth = 4, // نفس حجم البوردر في CSS
}: UseRippleProps) {
  const clickPos = useRef({ x: 0, y: 0 });
  const isClickInteraction = useRef(false);
  const hasInitialized = useRef(false);

  // تسجيل موقع النقر
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

    const targetBg = isDark ? colors.darkBg : colors.lightBg;
    const targetBorder = isDark ? colors.darkBorder : colors.lightBorder;

    // 1. الإعداد الأولي (عند فتح الصفحة فقط)
    if (!hasInitialized.current) {
      gsap.set(container, {
        backgroundColor: targetBg,
        borderColor: targetBorder,
      });
      gsap.set(ripple, { display: "none" }); // نخفي الـ Ripple
      hasInitialized.current = true;
      return;
    }

    const rect = container.getBoundingClientRect();

    // نحدد نقطة الهدف داخل الكونتينر
    const clickX = isClickInteraction.current
      ? clickPos.current.x
      : rect.width / 2;
    const clickY = isClickInteraction.current
      ? clickPos.current.y
      : rect.height / 2;

    // 🔥 تصحيح الإحداثيات: لأن الـ Ripple أكبر من الزر بـ 4px من كل جهة
    // يجب أن نضيف قيمة البوردر للإحداثيات لكي تكون الكرة تحت الإصبع تماماً
    const rippleX = clickX + borderWidth;
    const rippleY = clickY + borderWidth;

    // حساب ارتفاع الـ Ripple الكلي (لنعرف أين يقع القاع "Bottom")
    const rippleHeight = rect.height + borderWidth * 2;

    const tl = gsap.timeline();

    // 2. تجهيز الطبقة
    tl.set(ripple, {
      backgroundColor: targetBg,
      borderColor: targetBorder,
      display: "block",
      zIndex: 0, // خلف الأيقونات
      // نبدأ من الأسفل (Bottom Center of X)
      // نستخدم rippleHeight بدلاً من 100% لضمان دقة بكسل مع GSAP
      clipPath: `circle(10px at ${rippleX}px ${rippleHeight}px)`,
    });

    // 3. المرحلة الأولى: الصعود لمكان النقر 🚀
    tl.to(ripple, {
      clipPath: `circle(15px at ${rippleX}px ${rippleY}px)`,
      duration: 0.3,
      ease: "power2.out",
    });

    // 4. المرحلة الثانية: التوسع الكامل 💥
    tl.to(ripple, {
      clipPath: `circle(150% at ${rippleX}px ${rippleY}px)`,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // تثبيت الألوان على الزر الأصلي وإخفاء الـ Ripple
        gsap.set(container, {
          backgroundColor: targetBg,
          borderColor: targetBorder,
        });
        gsap.set(ripple, { display: "none" });
        isClickInteraction.current = false;
      },
    });
  }, [isDark]);

  return { registerClick };
}
