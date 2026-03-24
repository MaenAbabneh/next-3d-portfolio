"use client";

import type { RefObject } from "react";
import {
  COIN_COLORS,
  DOLLAR_GEOMETRY,
  FILL_GEOMETRY,
  LIQUID_GEOMETRY,
  MOUTH_PATHS,
} from "@/constant/coinConstants";

export type CoinSvgIds = {
  fillClip: string;
  goldGlassGrad: string;
  liquidGoldGrad: string;
  highlightGrad: string;
  highlightGradReverse: string;
  tongueMask: string;
};

type Props = {
  svgIds: CoinSvgIds;
  isFull: boolean;
  fillRectRef: RefObject<SVGRectElement | null>;
  liquidGroupRef: RefObject<SVGGElement | null>;
  mouthRef: RefObject<SVGPathElement | null>;
  setEyesGroupRef: (el: SVGGElement | null) => void;
  scale?: number;
};

export default function CoinSVG({
  svgIds,
  isFull,
  fillRectRef,
  liquidGroupRef,
  mouthRef,
  setEyesGroupRef,
  scale = 0.8,
}: Props) {
  const dollarTransform = `translate(${DOLLAR_GEOMETRY.DOLLAR_TRANSLATE_X} ${DOLLAR_GEOMETRY.DOLLAR_TRANSLATE_Y}) translate(${DOLLAR_GEOMETRY.DOLLAR_CENTER_X} ${DOLLAR_GEOMETRY.DOLLAR_CENTER_Y}) scale(${DOLLAR_GEOMETRY.DOLLAR_SCALE}) translate(${-DOLLAR_GEOMETRY.DOLLAR_CENTER_X} ${-DOLLAR_GEOMETRY.DOLLAR_CENTER_Y})`;

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full drop-shadow-2xl"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={svgIds.fillClip} clipPathUnits="userSpaceOnUse">
          <rect
            ref={fillRectRef}
            x="0"
            y={FILL_GEOMETRY.BOTTOM_Y + LIQUID_GEOMETRY.FILL_EPSILON}
            width="500"
            height="500"
          />
        </clipPath>

        {/* تدرج الزجاج الخارجي */}
        <linearGradient
          id={svgIds.goldGlassGrad}
          x1="0"
          y1="500"
          x2="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={COIN_COLORS.glassLower} />
          <stop offset="1" stopColor={COIN_COLORS.glassUpper} />
        </linearGradient>

        {/* تدرج السائل الذهبي */}
        <linearGradient
          id={svgIds.liquidGoldGrad}
          x1="0"
          y1="500"
          x2="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffdc64" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>

        <mask id={svgIds.tongueMask} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="500" height="500" fill="black" />
          <path
            d="M 285 290 H 215 C 215 290 200 290 200 310 C 200 330 224 350 250 350 C 276 350 300 330 300 310 C 300 290 285 290 285 290 Z"
            fill="white"
          />
        </mask>
      </defs>
      <g transform={`translate(250 250) scale(${scale}) translate(-250 -250)`}>
        {/* 1. الطبقة الزجاجية الأساسية (الفارغة) */}
        <g opacity="0.8">
          <circle
            fill={`url(#${svgIds.goldGlassGrad})`}
            cx="294.631"
            cy="264.535"
            strokeWidth="4"
            stroke="rgb(0, 0, 0)"
            r="256"
            transform="matrix(0.64, 0, 0, 0.6, 56.25, 76.5)"
          />

          {/* علامة الدولار المنحوتة في الزجاج */}
          <g transform={dollarTransform}>
            <path
              fill="rgba(210, 180, 100, 0.0)"
              stroke="rgba(0, 0, 0, 0.55)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              d="M 272.613 248.755 L 272.613 192.056 C 284.317 196.148 292.4 203.167 292.4 210.796 C 292.4 215.236 296.199 218.838 300.88 218.838 C 305.562 218.838 309.36 215.236 309.36 210.796 C 309.36 194.417 294.362 180.746 272.613 175.08 L 272.613 169.581 C 272.613 165.141 268.815 161.539 264.134 161.539 C 259.452 161.539 255.654 165.141 255.654 169.581 L 255.654 172.442 C 253.792 172.332 251.912 172.262 250 172.262 C 248.087 172.262 246.207 172.332 244.345 172.442 L 244.345 169.581 C 244.345 165.141 240.548 161.539 235.866 161.539 C 231.185 161.539 227.386 165.141 227.386 169.581 L 227.386 175.08 C 205.636 180.746 190.639 194.417 190.639 210.796 C 190.639 232.508 206.486 243.455 227.386 251.245 L 227.386 307.944 C 215.682 303.852 207.599 296.833 207.599 289.204 C 207.599 284.764 203.8 281.162 199.119 281.162 C 194.437 281.162 190.639 284.764 190.639 289.204 C 190.639 305.582 205.636 319.254 227.386 324.92 L 227.386 330.419 C 227.386 334.859 231.185 338.461 235.866 338.461 C 240.548 338.461 244.345 334.859 244.345 330.419 L 244.345 327.559 C 246.207 327.668 248.087 327.739 250 327.739 C 251.912 327.739 253.792 327.668 255.654 327.559 L 255.654 330.419 C 255.654 334.859 259.452 338.461 264.134 338.461 C 268.815 338.461 272.613 334.859 272.613 330.419 L 272.613 324.921 C 294.362 319.254 309.36 305.584 309.36 289.204 C 309.361 267.492 293.514 256.545 272.613 248.755 Z M 250 188.345 C 251.912 188.345 253.791 188.447 255.654 188.591 L 255.654 243.233 C 254.585 242.921 253.523 242.606 252.445 242.298 C 249.562 241.475 246.904 240.671 244.345 239.873 L 244.345 188.591 C 246.208 188.446 248.087 188.345 250 188.345 Z M 207.599 210.795 C 207.599 203.166 215.681 196.148 227.386 192.055 L 227.386 233.713 C 212.857 227.305 207.599 220.615 207.599 210.795 Z M 250 311.655 C 248.087 311.655 246.208 311.553 244.345 311.409 L 244.345 256.767 C 245.414 257.079 246.476 257.394 247.554 257.702 C 250.437 258.524 253.095 259.329 255.654 260.127 L 255.654 311.409 C 253.791 311.554 251.912 311.655 250 311.655 Z M 272.613 307.944 L 272.613 266.286 C 287.142 272.695 292.4 279.385 292.4 289.204 C 292.4 296.833 284.318 303.852 272.613 307.944 Z"
            />
          </g>
        </g>

        {/* 2. الطبقة الممتلئة (السائل الذهبي) */}
        <g clipPath={`url(#${svgIds.fillClip})`}>
          {/* مجموعة السائل فقط هي التي تدور بشكل عكسي لتحافظ على الأفقية */}
          <g ref={liquidGroupRef}>
            <circle
              fill={`url(#${svgIds.liquidGoldGrad})`}
              cx="294.631"
              cy="264.535"
              r="256"
              strokeWidth="4"
              stroke="rgb(0, 0, 0)"
              transform="matrix(0.64, 0, 0, 0.6, 56.25, 76.5)"
            />
            <circle
              style={{ fill: "rgb(255, 200, 80)", strokeWidth: 1 }}
              cx="294.631"
              cy="264.535"
              r="220.69"
              transform="matrix(0.640431, 0, 0, 0.607333, 56.256374, 76.528847)"
            />
            <circle
              xmlns="http://www.w3.org/2000/svg"
              style={{ fill: "rgb(255, 240, 130)", strokeWidth: 1 }}
              cx="294.631"
              cy="264.535"
              r="194.207"
              transform="matrix(0.640431, 0, 0, 0.607333, 56.256374, 76.528847)"
            />
          </g>

          {/* علامة الدولار الممتلئة تُوضع خارج liquidGroupRef لتدور مع الزجاجة بشكل طبيعي وتتطابق معها */}
          <g transform={dollarTransform}>
            <path
              fill="#e7b452"
              stroke="rgba(0, 0, 0, 0.55)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              d="M 272.613 248.755 L 272.613 192.056 C 284.317 196.148 292.4 203.167 292.4 210.796 C 292.4 215.236 296.199 218.838 300.88 218.838 C 305.562 218.838 309.36 215.236 309.36 210.796 C 309.36 194.417 294.362 180.746 272.613 175.08 L 272.613 169.581 C 272.613 165.141 268.815 161.539 264.134 161.539 C 259.452 161.539 255.654 165.141 255.654 169.581 L 255.654 172.442 C 253.792 172.332 251.912 172.262 250 172.262 C 248.087 172.262 246.207 172.332 244.345 172.442 L 244.345 169.581 C 244.345 165.141 240.548 161.539 235.866 161.539 C 231.185 161.539 227.386 165.141 227.386 169.581 L 227.386 175.08 C 205.636 180.746 190.639 194.417 190.639 210.796 C 190.639 232.508 206.486 243.455 227.386 251.245 L 227.386 307.944 C 215.682 303.852 207.599 296.833 207.599 289.204 C 207.599 284.764 203.8 281.162 199.119 281.162 C 194.437 281.162 190.639 284.764 190.639 289.204 C 190.639 305.582 205.636 319.254 227.386 324.92 L 227.386 330.419 C 227.386 334.859 231.185 338.461 235.866 338.461 C 240.548 338.461 244.345 334.859 244.345 330.419 L 244.345 327.559 C 246.207 327.668 248.087 327.739 250 327.739 C 251.912 327.739 253.792 327.668 255.654 327.559 L 255.654 330.419 C 255.654 334.859 259.452 338.461 264.134 338.461 C 268.815 338.461 272.613 334.859 272.613 330.419 L 272.613 324.921 C 294.362 319.254 309.36 305.584 309.36 289.204 C 309.361 267.492 293.514 256.545 272.613 248.755 Z M 250 188.345 C 251.912 188.345 253.791 188.447 255.654 188.591 L 255.654 243.233 C 254.585 242.921 253.523 242.606 252.445 242.298 C 249.562 241.475 246.904 240.671 244.345 239.873 L 244.345 188.591 C 246.208 188.446 248.087 188.345 250 188.345 Z M 207.599 210.795 C 207.599 203.166 215.681 196.148 227.386 192.055 L 227.386 233.713 C 212.857 227.305 207.599 220.615 207.599 210.795 Z M 250 311.655 C 248.087 311.655 246.208 311.553 244.345 311.409 L 244.345 256.767 C 245.414 257.079 246.476 257.394 247.554 257.702 C 250.437 258.524 253.095 259.329 255.654 260.127 L 255.654 311.409 C 253.791 311.554 251.912 311.655 250 311.655 Z M 272.613 307.944 L 272.613 266.286 C 287.142 272.695 292.4 279.385 292.4 289.204 C 292.4 296.833 284.318 303.852 272.613 307.944 Z"
            />
          </g>
        </g>

        {/* 4. الوجه */}
        {isFull ? (
          <>
            <g ref={setEyesGroupRef}>
              <path
                d="M 166 195 Q 178 175 190 195"
                fill="none"
                stroke={COIN_COLORS.face}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 302 195 Q 314 175 326 195"
                fill="none"
                stroke={COIN_COLORS.face}
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>

            <g>
              <path
                d="M 285 290 H 215 C 215 290 200 290 200 310 C 200 330 224 350 250 350 C 276 350 300 330 300 310 C 300 290 285 290 285 290 Z"
                fill={COIN_COLORS.openMouth}
              />
              <g mask={`url(#${svgIds.tongueMask})`}>
                <circle cx="250" cy="360" r="25" fill={COIN_COLORS.tongue} />
              </g>
            </g>
          </>
        ) : (
          <g>
            <g ref={setEyesGroupRef}>
              <ellipse
                fill={COIN_COLORS.face}
                cx="314"
                cy="185"
                rx="12"
                ry="12"
              />
              <ellipse
                fill={COIN_COLORS.face}
                cx="178"
                cy="183"
                rx="12"
                ry="12"
              />
            </g>
            <path
              ref={mouthRef}
              d={MOUTH_PATHS.sad}
              fill="none"
              stroke={COIN_COLORS.face}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* تأثير زجاجي إضافي فوق كل شيء */}
        <g opacity="0.9">
          <path
            d="M 139.69 136.605 C 143.489 133.247 151.361 130.864 159.446 128.729 C 167.508 126.602 175.506 124.791 185.553 124.295"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#000"
            transform="matrix(0.935075, -0.354449, 0.354449, 0.935075, 0.000001, -0.000002)"
            style={{
              fillOpacity: 0.3,
              transformOrigin: "156.902px 133.235px",
            }}
          />
          <path
            d="M 113.53 179.421 C 117.124 173.802 122.564 170.583 128.213 169.12"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#000"
            transform="matrix(0.922309, -0.386453, 0.386453, 0.922309, 0.000003, 0.000003)"
            style={{
              fillOpacity: 0.52,
              transformBox: "fill-box",
              transformOrigin: "50% 50%",
            }}
          />
        </g>
      </g>
    </svg>
  );
}
