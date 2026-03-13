"use client";

import { Html } from "@react-three/drei";
import { useState, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// 🌟 1. استيراد أيقونة Enter من مكتبة react-icons
import { BsArrowReturnLeft } from "react-icons/bs";

interface InteractiveMarkerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  visible?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function InteractiveMarker({
  position,
  rotation = [0, 0, 0],
  title,
  visible = true,
  onClick,
}: InteractiveMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rectRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.click();
  };

  const handleEnter = () => setIsHovered(true);
  const handleLeave = () => setIsHovered(false);

  useGSAP(() => {
    if (!rectRef.current) return;

    if (isHovered) {
      gsap.to(rectRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
      });
    } else {
      gsap.to(rectRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isHovered]);

  return (
    <Html
      transform
      occlude={false}
      position={position}
      rotation={rotation}
      distanceFactor={1.5}
      zIndexRange={[10, 0]}
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        background: "transparent",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
          background: "transparent",
        }}
        role="button"
        tabIndex={0}
        aria-label={title}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(e);
        }}
      >
        {/* شكل المعين */}
        <div
          style={{
            width: isHovered ? "28px" : "20px",
            height: isHovered ? "28px" : "20px",
            backgroundColor: isHovered ? "black" : "white",
            border: isHovered ? "2px solid white" : "2px solid black",
            transform: "rotate(45deg)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 🌟 2. استخدام مكون الأيقونة الجاهز */}
          <BsArrowReturnLeft
            size={14} // حجم الأيقونة
            color="white" // لون الأيقونة
            style={{
              // الدوران العكسي (-45) لتبقى مستقيمة داخل المعين المائل
              transform: "rotate(-45deg)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease 0.1s", // تأخير بسيط لظهور سلس
              // لمسة إضافية: جعل الأيقونة أعرض قليلاً لتبدو أوضح
              strokeWidth: "1",
            }}
          />
        </div>

        {/* حاوية التموضع للمستطيل */}
        <div
          style={{
            position: "absolute",
            right: "50%",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {/* المستطيل المنبثق */}
          <div
            ref={rectRef}
            style={{
              color: "white",
              background: "black",
              borderTop: isHovered ? "2px solid white" : "2px solid black",
              borderBottom: isHovered ? "2px solid white" : "2px solid black",
              borderLeft: isHovered ? "2px solid white" : "2px solid black",
              borderRight: "none",
              padding: "5px 16px 5px 12px",
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transformOrigin: "right center",
              transform: "scaleX(0)",
              opacity: 0,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </Html>
  );
}
