import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";

export const useWackyCoinTilt = (params: {
  isFull: boolean;
  tiltRef: React.RefObject<HTMLDivElement | null>;
  liquidGroupRef?: React.RefObject<SVGGElement | null>;
  svgOrigin?: string;
}) => {
  const { isFull, tiltRef, liquidGroupRef, svgOrigin = "250 250" } = params;

  const setEyesXRef = useRef<((value: number) => void) | null>(null);
  const setEyesYRef = useRef<((value: number) => void) | null>(null);
  const setRotateRef = useRef<((value: number) => void) | null>(null);
  const setLiquidRotateRef = useRef<((value: number) => void) | null>(null);

  const setEyesGroupRef = useCallback((el: SVGGElement | null) => {
    // عنصر العيون يتبدّل بين حالتين (ممتلئ/غير ممتلئ) — جهّز quickTo عند كل تغيير.
    if (!el) {
      setEyesXRef.current = null;
      setEyesYRef.current = null;
      return;
    }

    setEyesXRef.current = gsap.quickTo(el, "x", {
      duration: 0.18,
      ease: "power3.out",
    });
    setEyesYRef.current = gsap.quickTo(el, "y", {
      duration: 0.18,
      ease: "power3.out",
    });
  }, []);

  useLayoutEffect(() => {
    // إعداد دالة سريعة للدوران 2D (بدون أي تأثير ثلاثي الأبعاد).
    if (tiltRef.current) {
      setRotateRef.current = gsap.quickTo(tiltRef.current, "rotation", {
        duration: 0.22,
        ease: "power3.out",
      });
    }

    // السائل (الطبقة الداخلية) لا يدور: طبّق دوران عكسي داخل الـSVG.
    if (liquidGroupRef?.current) {
      setLiquidRotateRef.current = gsap.quickTo(
        liquidGroupRef.current,
        "rotation",
        {
          duration: 0.22,
          ease: "power3.out",
          svgOrigin,
        },
      );
    }

    return () => {
      setEyesXRef.current = null;
      setEyesYRef.current = null;
      setRotateRef.current = null;
      setLiquidRotateRef.current = null;
    };
  }, [tiltRef, liquidGroupRef, svgOrigin]);

  useEffect(() => {
    if (!isFull) return;
    setEyesXRef.current?.(0);
    setEyesYRef.current?.(0);
  }, [isFull]);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      // عند الامتلاء: دع أنيميشن القفز/الدوران يتحكم بالحركة
      if (isFull) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const dxNorm =
        (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dyNorm =
        (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      const x = Math.max(-1, Math.min(1, dxNorm));
      const y = Math.max(-1, Math.min(1, dyNorm));

      // تحريك العيون داخل الـSVG (بوحدات viewBox تقريباً)
      const eyesX = x * 6;
      const eyesY = y * 4;
      setEyesXRef.current?.(eyesX);
      setEyesYRef.current?.(eyesY);

      // دوران 2D طبيعي (rotationZ) بدون perspective/3D
      const rotation = x * 8;
      setRotateRef.current?.(rotation);

      // ابقِ السائل ثابتًا (بدون دوران)
      setLiquidRotateRef.current?.(-rotation);
    },
    [isFull],
  );

  const handleMouseLeaveVisual = useCallback(() => {
    setEyesXRef.current?.(0);
    setEyesYRef.current?.(0);
    setRotateRef.current?.(0);
    setLiquidRotateRef.current?.(0);
  }, []);

  return {
    setEyesGroupRef,
    handleMouseMove,
    handleMouseLeaveVisual,
  };
};
