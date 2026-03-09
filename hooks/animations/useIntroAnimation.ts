import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { objectsWithIntroAnimations, SUFFIX } from "@/constant/utils";
import { useGameStore } from "@/store/useGameStore";

gsap.registerPlugin(useGSAP);

// --- ⚡ إعدادات السرعة ---
const GLOBAL_SPEED = 0.5; // السرعة العامة (تحكم بها لتسريع/تبطيء المشهد كاملاً)
const POP_DURATION = 0.5; // سرعة ظهور العنصر
const PIANO_JUMP_SPEED = 0.3; // سرعة قفزة البيانو
const INTRO_START_DELAY = 0.5;

// مفاتيح التخزين
const INTRO_SCALE_KEY = "__introOriginalScale";
const INTRO_POS_KEY = "__introOriginalPosition";

// --- دوال مساعدة ---
const isMeshLike = (
  obj: THREE.Object3D,
): obj is THREE.Mesh | THREE.SkinnedMesh => {
  return obj instanceof THREE.Mesh || obj instanceof THREE.SkinnedMesh;
};

const isPianoKey = (name: string) => {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  return notes.some((note) => name.startsWith(note) && /\d/.test(name));
};

const resolveSearchTokens = (shortName: string): string[] => {
  if (isPianoKey(shortName)) return [`${shortName}${SUFFIX}`, shortName];
  return [shortName];
};

const getOriginalScale = (obj: THREE.Object3D) =>
  (obj.userData[INTRO_SCALE_KEY] as THREE.Vector3) ||
  new THREE.Vector3(1, 1, 1);
const getOriginalPosition = (obj: THREE.Object3D) =>
  (obj.userData[INTRO_POS_KEY] as THREE.Vector3) || new THREE.Vector3();

// --- الـ Hook ---
export const useIntroAnimation = (groupRef: RefObject<THREE.Group | null>) => {
  const started = useGameStore((s) => s.started);
  useGSAP(
    () => {
      const scene = groupRef.current;
      if (!scene) return;

      const targets: Record<string, THREE.Object3D[]> = {};

      // 1. منطق البحث
      const findAllMatchingMeshes = (shortName: string) => {
        const tokens = resolveSearchTokens(shortName);
        const matches: THREE.Object3D[] = [];
        scene.traverse((child) => {
          if (!isMeshLike(child)) return;
          for (const token of tokens) {
            if (child.name.includes(token)) {
              matches.push(child);
              break;
            }
          }
        });
        return matches.filter(
          (v, i, a) => a.findIndex((t) => t.uuid === v.uuid) === i,
        );
      };

      const getTargetObjects = (name: string) => targets[name] ?? [];

      // 2. التجهيز والحفظ
      objectsWithIntroAnimations.forEach((name) => {
        const objs = findAllMatchingMeshes(name);
        if (objs.length === 0) return;
        targets[name] = objs;

        objs.forEach((obj) => {
          if (!obj.userData[INTRO_SCALE_KEY])
            obj.userData[INTRO_SCALE_KEY] = obj.scale.clone();
          if (!obj.userData[INTRO_POS_KEY])
            obj.userData[INTRO_POS_KEY] = obj.position.clone();

          if (!started) {
            const original = getOriginalScale(obj);
            if (name.includes("Hanging_Plank")) {
              obj.scale.set(original.x, 0, original.z);
            } else {
              obj.scale.set(0, 0, 0);
            }
          }
        });
      });

      if (!started) return;

      // =========================================================
      // 3. بناء التايم لاين الرئيسي (The Master Timeline) 🎬
      // =========================================================

      const masterTl = gsap.timeline({
        delay: INTRO_START_DELAY,
        defaults: { ease: "back.out(1.7)", duration: POP_DURATION },
      });
      masterTl.timeScale(GLOBAL_SPEED); // التحكم بالسرعة الكلية من هنا

      // دالة مساعدة لإضافة عناصر لتايم لاين محدد
      const addToTl = (
        tl: gsap.core.Timeline,
        objName: string,
        position: string = "<0.1",
      ) => {
        const objs = getTargetObjects(objName);
        objs.forEach((obj) => {
          const s = getOriginalScale(obj);
          tl.to(obj.scale, { x: s.x, y: s.y, z: s.z }, position);
        });
      };

      // --- المجموعة 1: الألواح (Planks) ---
      const planksTl = gsap.timeline();
      const p1 = getTargetObjects("Hanging_Plank_1")[0];
      const p2 = getTargetObjects("Hanging_Plank_2")[0];
      if (p1) planksTl.to(p1.scale, { y: getOriginalScale(p1).y });
      if (p2) planksTl.to(p2.scale, { y: getOriginalScale(p2).y }, "<0.1");

      // إضافة الألواح للماستر (تبدأ عند الوقت 0)
      masterTl.add(planksTl, 0);

      // --- المجموعة 2: الأزرار (Buttons) ---
      const buttonsTl = gsap.timeline();
      addToTl(buttonsTl, "My_Work_Button", "0");
      addToTl(buttonsTl, "About_Button", "<0.1");
      addToTl(buttonsTl, "Contact_Button", "<0.1");

      // الأزرار تبدأ بعد الألواح بـ 0.1 ثانية
      masterTl.add(buttonsTl, 0.2);

      // --- المجموعة 3: الإطارات (Frames) ---
      const framesTl = gsap.timeline();
      ["Frame_1", "Frame_2", "Frame_3"].forEach((f) =>
        addToTl(framesTl, f, "<0.1"),
      );
      masterTl.add(framesTl, 0.1);

      // --- المجموعة 4: السوشيال (Socials) ---
      const socialTl = gsap.timeline();
      addToTl(socialTl, "Boba", "0");
      addToTl(socialTl, "GitHub", "<0.1");
      addToTl(socialTl, "LinkedIn", "<0.1");
      addToTl(socialTl, "X", "<0.1");
      masterTl.add(socialTl, 0.1);

      // --- المجموعة 5: الزهور (Flowers) ---
      const flowersTl = gsap.timeline();
      ["Flower_5", "Flower_4", "Flower_3", "Flower_2", "Flower_1"].forEach(
        (f) => addToTl(flowersTl, f, "<0.1"),
      );
      masterTl.add(flowersTl, 0.2);

      // --- المجموعة 6: متنوعات (Misc) ---
      const miscTl = gsap.timeline();
      ["Box_1", "Box_2", "Box_3"].forEach((b) => addToTl(miscTl, b, "<0.1"));
      addToTl(miscTl, "Lamp", "<0.1");
      addToTl(miscTl, "Slipper_1", "<0.1");
      addToTl(miscTl, "Slipper_2", "<0.1");
      ["Egg_1", "Egg_2", "Egg_3"].forEach((e) => addToTl(miscTl, e, "<0.1"));
      addToTl(miscTl, "Fish_Second", "<0.1");

      masterTl.add(miscTl, 0.1);

      // --- المجموعة 7: الحروف (Letters) 🔤 ---
      const lettersTl = gsap.timeline();
      const letterNames = objectsWithIntroAnimations.filter((n) =>
        n.startsWith("Name_Letter_"),
      );

      letterNames.forEach((name, i) => {
        const objs = getTargetObjects(name);
        objs.forEach((obj) => {
          const s = getOriginalScale(obj);
          lettersTl.to(
            obj.scale,
            { x: s.x, y: s.y, z: s.z, duration: 0.4 },
            i === 0 ? "0" : "<0.03",
          );
        });
      });

      masterTl.add(lettersTl, 0.1);

      // --- المجموعة 8: النقاط (Dots) ⚫ ---
      const dotsTl = gsap.timeline();
      const dotNames = objectsWithIntroAnimations.filter((n) =>
        n.startsWith("Dot_"),
      );

      dotNames.forEach((name, i) => {
        const objs = getTargetObjects(name);
        objs.forEach((obj) => {
          const s = getOriginalScale(obj);
          dotsTl.to(
            obj.scale,
            { x: s.x, y: s.y, z: s.z, duration: 0.4 },
            i === 0 ? "0" : "<0.05",
          );
        });
      });

      masterTl.add(dotsTl, 0.1);

      // --- المجموعة 9: البيانو (Piano) 🎹 ---
      const pianoTl = gsap.timeline({
        defaults: { duration: PIANO_JUMP_SPEED, ease: "back.out(1.7)" },
      });

      const pianoKeysNames = objectsWithIntroAnimations.filter((n) =>
        isPianoKey(n),
      );
      const allKeys: THREE.Object3D[] = [];
      pianoKeysNames.forEach((name) => allKeys.push(...getTargetObjects(name)));

      allKeys.forEach((key, i) => {
        const originalY = getOriginalPosition(key).y;
        const s = getOriginalScale(key);

        pianoTl
          .to(key.position, { y: originalY + 0.15 }, i * 0.02)
          .to(key.scale, { x: s.x, y: s.y, z: s.z }, "<")
          .to(key.position, { y: originalY }, ">");
      });

      masterTl.add(pianoTl, 0.1);
    },
    { dependencies: [started], scope: groupRef },
  );
};
