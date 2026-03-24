export const MOUTH_PATHS = {
  sad: "M 204 290 Q 245 265 286 290",
  happy: "M 204 280 Q 245 310 286 280",
} as const;

export type MouthState = keyof typeof MOUTH_PATHS;

export const MAX_CLICKS = 10;

export const DECREMENT_RETURN_DELAY_MS = 800;
export const HOVER_LEAVE_RETURN_DELAY_MS = 2000;

export const COIN_COLORS = {
  face: "rgba(13, 15, 18, 0.8)",
  openMouth: "#541222",
  tongue: "#a7253a",
  glassLower: "rgb(195 196 201 / 50%)",
  glassUpper: "rgba(205, 212, 234, .5)",
} as const;

export const PARTICLE_SVGS = [
  "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1774386892/partical1_szqmxk.svg",
  "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1774386892/partical2_gllmhu.svg",
  "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1774386892/partical3_tlvnmr.svg",
  "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1774386893/partical4_y1c6sk.svg",
  "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1774386893/partical5_o3p8z9.svg",
  "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1774386893/partical6_gk1tdc.svg",
] as const;

// حدود السائل محسوبة من نفس الدائرة + transform المستخدمة في الرسم
export const LIQUID_GEOMETRY = {
  LIQUID_CX: 294.631,
  LIQUID_CY: 264.535,
  LIQUID_R: 256,
  LIQUID_SCALE_X: 0.64,
  LIQUID_SCALE_Y: 0.6,
  LIQUID_TRANSLATE_X: 56.25,
  LIQUID_TRANSLATE_Y: 76.5,
  FILL_EPSILON: 2, // لمنع ظهور شريحة سائل عند 0%
} as const;

const COIN_CENTER_X =
  LIQUID_GEOMETRY.LIQUID_CX * LIQUID_GEOMETRY.LIQUID_SCALE_X +
  LIQUID_GEOMETRY.LIQUID_TRANSLATE_X;
const LIQUID_CENTER_Y =
  LIQUID_GEOMETRY.LIQUID_CY * LIQUID_GEOMETRY.LIQUID_SCALE_Y +
  LIQUID_GEOMETRY.LIQUID_TRANSLATE_Y;
const LIQUID_RADIUS_Y =
  LIQUID_GEOMETRY.LIQUID_R * LIQUID_GEOMETRY.LIQUID_SCALE_Y;
const TOP_Y = LIQUID_CENTER_Y - LIQUID_RADIUS_Y;
const BOTTOM_Y = LIQUID_CENTER_Y + LIQUID_RADIUS_Y;
const TOTAL_HEIGHT = BOTTOM_Y - TOP_Y;

export const FILL_GEOMETRY = {
  COIN_CENTER_X,
  LIQUID_CENTER_Y,
  LIQUID_RADIUS_Y,
  TOP_Y,
  BOTTOM_Y,
  TOTAL_HEIGHT,
} as const;

// مسار الدولار الحالي مبني تقريبًا حول (250, 250) داخل viewBox 500x500
export const DOLLAR_GEOMETRY = {
  DOLLAR_CENTER_X: 250,
  DOLLAR_CENTER_Y: 250,
  DOLLAR_SCALE: 1.15,
  DOLLAR_TRANSLATE_X: COIN_CENTER_X - 250,
  DOLLAR_TRANSLATE_Y: LIQUID_CENTER_Y - 250,
} as const;
