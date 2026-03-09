import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { objectsWithHoverAnimations } from "@/constant/utils";
import { SUFFIX } from "@/constant/utils";
import { HoverSettings } from "@/types/room.types";
import { HOVER_CONFIG } from "@/constant/utils";
import { useGameStore } from "@/store/useGameStore";

const SCALE_KEY = "__introOriginalScale";
const ROT_KEY = "__introOriginalRotation";
const POS_KEY = "__introOriginalPosition";

// --- دوال مساعدة ---
const isMesh = (obj: THREE.Object3D): obj is THREE.Mesh =>
  obj instanceof THREE.Mesh;

const resolveSearchTokens = (shortName: string): string[] => {
  return [`${shortName}${SUFFIX}`, shortName];
};

// 2️⃣ تحديد نوع الإرجاع للدالة ليكون HoverSettings
const getGroupSettings = (name: string): HoverSettings => {
  if (HOVER_CONFIG.BUTTONS.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.BUTTONS, type: "BUTTONS" };
  if (HOVER_CONFIG.FLOATING.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.FLOATING, type: "FLOATING" };
  if (HOVER_CONFIG.ANIMALS.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.ANIMALS, type: "ANIMALS" };
  if (HOVER_CONFIG.FLOWERS.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.FLOWERS, type: "FLOWERS" };
  if (HOVER_CONFIG.PENCILS.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.PENCILS, type: "PENCILS" };
  if (HOVER_CONFIG.BULBS.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.BULBS, type: "BULBS" };
  if (HOVER_CONFIG.LAMP.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.LAMP, type: "LAMP" };
  if (HOVER_CONFIG.EGG.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.EGG, type: "EGG" };
  if (HOVER_CONFIG.BOX.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.BOX, type: "BOX" };
  if (HOVER_CONFIG.FRAMES.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.FRAMES, type: "FRAMES" };
  if (HOVER_CONFIG.LETTER.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.LETTER, type: "LETTER" };
  if (HOVER_CONFIG.NATURE_BG.items?.some((k) => name.includes(k)))
    return { ...HOVER_CONFIG.NATURE_BG, type: "NATURE_BG" };

  return { ...HOVER_CONFIG.DEFAULT, type: "DEFAULT" };
};

export const useHoverAnimation = (
  groupRef: React.RefObject<THREE.Group | null>,
) => {
  const { camera, raycaster, pointer } = useThree();
  const started = useGameStore((s) => s.started);
  const hoverTargets = useRef<THREE.Object3D[]>([]);
  const hoveredObj = useRef<THREE.Object3D | null>(null);

  // 1️⃣ البحث وتخزين العناصر
  useEffect(() => {
    const scene = groupRef.current;
    if (!scene) return;
    const foundObjects: THREE.Object3D[] = [];

    objectsWithHoverAnimations.forEach((name) => {
      const tokens = resolveSearchTokens(name);
      let found: THREE.Object3D | undefined;

      scene.traverse((child) => {
        if (found || !isMesh(child)) return;
        for (const token of tokens) {
          if (child.name.includes(token)) {
            found = child;
            if (!child.userData[SCALE_KEY])
              child.userData[SCALE_KEY] = child.scale.clone();
            if (!child.userData[ROT_KEY])
              child.userData[ROT_KEY] = child.rotation.clone();
            if (!child.userData[POS_KEY])
              child.userData[POS_KEY] = child.position.clone();
            break;
          }
        }
      });
      if (found) foundObjects.push(found);
    });

    hoverTargets.current = foundObjects;
  }, [groupRef]);

  // 2️⃣ دالة الأنيميشن العامة
  const animateHover = (object: THREE.Object3D, isHovering: boolean) => {
    gsap.killTweensOf(object.scale);
    gsap.killTweensOf(object.rotation);
    gsap.killTweensOf(object.position);

    const initScale = object.userData[SCALE_KEY] as THREE.Vector3;
    const initRot = object.userData[ROT_KEY] as THREE.Euler;
    const initPos = object.userData[POS_KEY] as THREE.Vector3;

    // الآن TypeScript يعرف أن settings قد تحتوي على rotateX أو moveY اختيارياً
    const settings = getGroupSettings(object.name);
    const easeType = "back.out(2)";

    if (isHovering) {
      // ✅ Hover In
      gsap.to(object.scale, {
        x: initScale.x * settings.scale,
        y: initScale.y * settings.scale,
        z: initScale.z * settings.scale,
        duration: settings.duration,
        ease: easeType,
      });

      // التحقق من وجود rotateX قبل استخدامه (الآن مسموح به)
      if (settings.rotateX !== undefined) {
        const direction = object.name.includes("About") ? -1 : 1;
        gsap.to(object.rotation, {
          x: initRot.x + settings.rotateX * direction,
          duration: settings.duration,
          ease: easeType,
        });
      }
      // التحقق من وجود rotateY قبل استخدامه (الآن مسموح به)
      if (settings.rotateY !== undefined) {
        const direction = object.name.includes("About") ? -1 : 1;
        gsap.to(object.rotation, {
          y: initRot.y + settings.rotateY * direction,
          duration: settings.duration,
          ease: easeType,
        });
      }

      // التحقق من وجود moveY قبل استخدامه
      if (settings.moveY !== undefined) {
        gsap.to(object.position, {
          y: initPos.y + settings.moveY,
          duration: settings.duration,
          ease: easeType,
        });
      }
    } else {
      // ❌ Hover Out
      gsap.to(object.scale, {
        x: initScale.x,
        y: initScale.y,
        z: initScale.z,
        duration: 0.3,
        ease: easeType,
      });

      if (settings.rotateX !== undefined) {
        gsap.to(object.rotation, {
          x: initRot.x,
          duration: 0.3,
          ease: easeType,
        });
      }

      if (settings.rotateY !== undefined) {
        gsap.to(object.rotation, {
          y: initRot.y,
          duration: 0.3,
          ease: easeType,
        });
      }

      if (settings.moveY !== undefined) {
        gsap.to(object.position, {
          y: initPos.y,
          duration: 0.3,
          ease: easeType,
        });
      }
    }
  };

  // 3️⃣ حلقة Raycasting
  useFrame(() => {
    if (!started || hoverTargets.current.length === 0) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(hoverTargets.current, true);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      if (hoveredObj.current !== target) {
        if (hoveredObj.current) animateHover(hoveredObj.current, false);
        animateHover(target, true);
        hoveredObj.current = target;
      }
    } else {
      if (hoveredObj.current) {
        animateHover(hoveredObj.current, false);
        hoveredObj.current = null;
      }
    }
  });
};
