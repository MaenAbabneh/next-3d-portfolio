"use client";

import type { RefObject } from "react";
import type { LikeSvgIds } from "@/constant/useLikeSvgIds";

const HEART_PATH =
  "M13.2537 0.0255029C23.4033 0.0255029 25.0273 10.5191 25.0273 10.5191C25.0273 10.5191 26.6512 -0.60088 37.6129 0.0255029C44.3441 0.410148 48.7484 6.32169 48.9804 12.1981C49.7924 32.7656 28.7678 41.5 25.0273 41.5C21.2868 41.5 -0.549833 32.3459 1.07416 12.1981C1.54782 6.32169 6.29929 0.0255029 13.2537 0.0255029Z";

export type LikeButtonSVGProps = {
  svgIds: LikeSvgIds;
  isFull: boolean;
  activeMaskPolygonRef: RefObject<SVGPolygonElement | null>;
  mouthRef: RefObject<SVGPathElement | null>;
  setEyesGroupRef: (el: SVGGElement | null) => void;
  className?: string;
};

export default function LikeButtonSVG({
  svgIds,
  isFull,
  activeMaskPolygonRef,
  mouthRef,
  setEyesGroupRef,
  className,
}: LikeButtonSVGProps) {
  return (
    <svg
      viewBox="0 0 50 42"
      fill="none"
      className={className ?? "w-full h-full"}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={svgIds.activeGradient}
          x1="25"
          y1="42"
          x2="26.3796"
          y2="0.0453673"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(353deg, 100%, 52%)" />
          <stop offset="1" stopColor="hsl(313deg, 100%, 52%)" />
        </linearGradient>
        <linearGradient
          id={svgIds.inactiveGradient}
          x1="15"
          y1="41"
          x2="42"
          y2="-1.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--empty-heart-lower)" stopOpacity="0.8" />
          <stop
            offset="1"
            stopColor="var(--empty-heart-upper)"
            stopOpacity="0.8"
          />
        </linearGradient>
      </defs>

      <mask
        id={svgIds.likeButtonMask}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="50"
        height="42"
      >
        <path d={HEART_PATH} fill="white" />
      </mask>

      <mask
        id={svgIds.activeGradientMask}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="50"
        height="42"
      >
        <polygon
          ref={activeMaskPolygonRef}
          points="0,42 50,42 50,42 0,42"
          fill="white"
        />
      </mask>

      <g mask={`url(#${svgIds.likeButtonMask})`}>
        <path d={HEART_PATH} fill={`url(#${svgIds.inactiveGradient})`} />

        <g mask={`url(#${svgIds.activeGradientMask})`}>
          <path d={HEART_PATH} fill={`url(#${svgIds.activeGradient})`} />
        </g>

        {/* Face */}
        {isFull ? (
          <>
            <g ref={setEyesGroupRef}>
              <path
                d="M 13 23 Q 15 19, 17 23"
                stroke="var(--face-color)"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M 33 23 Q 35 19, 37 23"
                stroke="var(--face-color)"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </g>

            <g>
              <mask
                id={svgIds.tongueMask}
                maskUnits="userSpaceOnUse"
                x="20"
                y="27"
                width="11"
                height="6"
              >
                <path
                  d="M28.3333 27H21.6666C21.6666 27 20.0001 27 20 29C19.9999 31 22.3875 33 25 33C27.6125 33 30 31 30 29C30 27 28.3333 27 28.3333 27Z"
                  fill="white"
                />
              </mask>

              <path
                d="M28.3333 27H21.6666C21.6666 27 20.0001 27 20 29C19.9999 31 22.3875 33 25 33C27.6125 33 30 31 30 29C30 27 28.3333 27 28.3333 27Z"
                fill="var(--open-mouth-color)"
              />
              <g mask={`url(#${svgIds.tongueMask})`}>
                <circle cx="25" cy="35" r="5" fill="var(--tongue-color)" />
              </g>
            </g>
          </>
        ) : (
          <g>
            <g ref={setEyesGroupRef}>
              <circle cx="15" cy="22" r="2" fill="var(--face-color)" />
              <circle cx="35" cy="22" r="2" fill="var(--face-color)" />
            </g>
            <path
              ref={mouthRef}
              d="M 20 30 Q 25 33.6 30 30"
              stroke="var(--face-color)"
              strokeLinecap="round"
              fill="none"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Gloss / shade */}
        <g>
          <path
            d="M53.5 18.5L47 5C47 5 53.5 31.9722 24.5 36C-4.5 40.0278 1 1.5 1 1.5L-6.5 25L8.00002 44.5L15.5 52L39 49L53.5 18.5Z"
            fill="black"
            fillOpacity="0.1"
          />
          <path
            d="M6.14471 8.44525C6.64924 7.12038 7.41962 5.99208 8.36394 5.15003C9.30652 4.30953 10.3901 3.78182 11.5089 3.58622"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31.7084 5.95975C32.7822 4.70067 34.1021 3.81419 35.484 3.37609"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
