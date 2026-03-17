"use client";

import { Html } from "@react-three/drei";
import { useState, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BsArrowReturnLeft } from "react-icons/bs";
import { useUISound } from "@/hooks/audio/useUISound";

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
  const [prevVisible, setPrevVisible] = useState(visible);
  const rectRef = useRef<HTMLDivElement>(null);

  const { playHover, playClick } = useUISound();

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (!visible && isHovered) {
      setIsHovered(false);
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!visible) return;
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.click();
    playClick();
  };

  const handleEnter = () => {
    if (!visible) return;
    setIsHovered(true);
    playHover();
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  useGSAP(() => {
    if (!rectRef.current) return;

    if (isHovered && visible) {
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
  }, [isHovered, visible]); // 🌟 أضفنا visible للمراقبة

  return (
    <Html
      transform
      occlude={false}
      position={position}
      rotation={rotation}
      distanceFactor={1.5}
      zIndexRange={[10, 0]}
      style={{
        pointerEvents: visible ? "auto" : "none",
        display: "flex",
        alignItems: "center",
        background: "transparent",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        cursor: visible ? "pointer" : "default",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          pointerEvents: visible ? "auto" : "none",
          background: "transparent",
        }}
        role="button"
        tabIndex={visible ? 0 : -1}
        aria-label={title}
        aria-hidden={!visible}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (!visible) return;
          e.stopPropagation();
          if (onClick) onClick(e);
          playClick();
        }}
      >
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
          <BsArrowReturnLeft
            size={14}
            color="white"
            style={{
              transform: "rotate(-45deg)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease 0.1s",
              strokeWidth: "1",
            }}
          />
        </div>
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
