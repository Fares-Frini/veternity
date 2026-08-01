"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import Pupil from "./Pupil";
import HorseBody from "./bodies/Horse";
import CatBody from "./bodies/Cat";
import CowBody from "./bodies/Cow";
import DogBody from "./bodies/Dog";

export type Who = "horse" | "cat" | "cow" | "dog";

interface AnimatedCharactersProps {
  isTyping?: boolean;
  showPassword?: boolean;
  passwordLength?: number;
  entrance?: boolean;
  mirrored?: boolean;
  characters?: Who[];
}

const EYE = "#1F1F1F";

const FACE: Record<Who, { left: number; top: number }> = {
  horse: { left: 120, top: 90 },
  cat: { left: 68, top: 69 },
  cow: { left: 130, top: 104 },
  dog: { left: 75, top: 38 },
};

const FACE_TRAVEL: Record<Who, number> = { horse: 0.5, cat: 1, cow: 0.5, dog: 1 };

const POSE = {
  look: { horse: [10, 25], cat: [6, -20] } as Record<"horse" | "cat", [number, number]>,
  hide: { horse: [10, 25] } as Record<"horse", [number, number]>,
  show: {
    horse: [-38, -5],
    cat: [-16, -4],
    cow: [-32, -5],
    dog: [-14, -5],
  } as Record<Who, [number, number]>,
};

const HORSE_EYE_GAP = 22;
const HORSE_EYE_GAP_SHOW = 10;
const DOG_EYE_GAP = 30;
const DOG_EYE_GAP_SHOW = 16;

const HORSE_HEIGHT = 420;
const HORSE_HEIGHT_STRETCHED = 465;

const LAYOUT: Record<Who, { left: number; width: number; height: number; zIndex: number }> = {
  cow: { left: 0, width: 243, height: 235, zIndex: 3 },
  horse: { left: 105, width: 233, height: HORSE_HEIGHT, zIndex: 1 },
  cat: { left: 235, width: 207, height: 250, zIndex: 2 },
  dog: { left: 375, width: 180, height: 183, zIndex: 4 },
};

const ALL_CHARACTERS: Who[] = ["cow", "horse", "cat", "dog"];

type QuickToFn = (value: number) => void;

const faceStyle = (base: { left: number; top: number }, gap: number): CSSProperties => ({
  position: "absolute",
  display: "flex",
  gap: `${gap}px`,
  left: `${base.left}px`,
  top: `${base.top}px`,
});

export default function AnimatedCharacters({
  isTyping = false,
  showPassword = false,
  passwordLength = 0,
  entrance = false,
  mirrored = false,
  characters = ALL_CHARACTERS,
}: AnimatedCharactersProps) {
  const mirror = mirrored ? -1 : 1;

  const included = ALL_CHARACTERS.filter((who) => characters.includes(who));
  const shown = {
    horse: included.includes("horse"),
    cat: included.includes("cat"),
    cow: included.includes("cow"),
    dog: included.includes("dog"),
  };

  const groupLeft = included.length ? Math.min(...included.map((who) => LAYOUT[who].left)) : 0;
  const groupRight = included.length
    ? Math.max(...included.map((who) => LAYOUT[who].left + LAYOUT[who].width))
    : 0;
  const groupWidth = groupRight - groupLeft;
  const packedLeft = (who: Who) => LAYOUT[who].left - groupLeft;

  const containerRef = useRef<HTMLDivElement>(null);
  const horseRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const cowRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);

  const horseFaceRef = useRef<HTMLDivElement>(null);
  const catFaceRef = useRef<HTMLDivElement>(null);
  const cowFaceRef = useRef<HTMLDivElement>(null);
  const dogFaceRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const quickToRef = useRef<Partial<Record<string, QuickToFn>> | null>(null);

  const lookingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const horsePeekTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isHidingPassword = passwordLength > 0 && !showPassword;
  const isShowingPassword = passwordLength > 0 && showPassword;

  const stateRef = useRef({
    isTyping,
    isHidingPassword,
    isShowingPassword,
    isLooking: false,
  });

  useEffect(() => {
    stateRef.current.isTyping = isTyping;
    stateRef.current.isHidingPassword = isHidingPassword;
    stateRef.current.isShowingPassword = isShowingPassword;
  }, [isTyping, isHidingPassword, isShowingPassword]);

  const mirrorRef = useRef(mirror);
  useEffect(() => {
    mirrorRef.current = mirror;
  }, [mirror]);

  const setFace = (who: Who, [dx, dy]: readonly [number, number]) => {
    const qt = quickToRef.current;
    if (!qt) return;
    const base = FACE[who];
    qt[`${who}FaceLeft`]?.(base.left + dx * mirror);
    qt[`${who}FaceTop`]?.(base.top + dy);
  };

  const movePupils = (host: HTMLElement | null, x: number, y: number) => {
    host?.querySelectorAll<HTMLElement>(".pupil").forEach((p) => {
      gsap.to(p, { x: x * mirror, y, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    });
  };

  const applyLookAtEachOther = () => {
    setFace("horse", POSE.look.horse);
    setFace("cat", POSE.look.cat);
    movePupils(horseRef.current, 3, 4);
    movePupils(catRef.current, 0, -4);
  };

  const applyHidingPassword = () => {
    setFace("horse", POSE.hide.horse);
  };

  const applyShowPassword = () => {
    const qt = quickToRef.current;
    if (qt) {
      qt.horseSkew?.(0);
      qt.catSkew?.(0);
      qt.cowSkew?.(0);
      qt.dogSkew?.(0);
      qt.horseX?.(0);
      qt.catX?.(0);
      qt.horseHeight?.(HORSE_HEIGHT);
      qt.horseEyeGap?.(HORSE_EYE_GAP_SHOW);
      qt.dogEyeGap?.(DOG_EYE_GAP_SHOW);
    }

    setFace("horse", POSE.show.horse);
    setFace("cat", POSE.show.cat);
    setFace("cow", POSE.show.cow);
    setFace("dog", POSE.show.dog);

    movePupils(horseRef.current, -4, -4);
    movePupils(catRef.current, -4, -4);
    movePupils(cowRef.current, -5, -4);
    movePupils(dogRef.current, -5, -4);
  };

  const resetEyeGap = () => {
    const qt = quickToRef.current;
    if (!qt) return;
    qt.horseEyeGap?.(HORSE_EYE_GAP);
    qt.dogEyeGap?.(DOG_EYE_GAP);
  };

  useEffect(() => {
    const REF: Record<Who, HTMLDivElement | null> = {
      horse: horseRef.current,
      cat: catRef.current,
      cow: cowRef.current,
      dog: dogRef.current,
    };
    const FACE_REF: Record<Who, HTMLDivElement | null> = {
      horse: horseFaceRef.current,
      cat: catFaceRef.current,
      cow: cowFaceRef.current,
      dog: dogFaceRef.current,
    };

    if (included.some((who) => !REF[who] || !FACE_REF[who])) return;

    gsap.set(".pupil", { x: 0, y: 0 });

    const smooth = (target: HTMLElement, prop: string, duration = 0.3) =>
      gsap.quickTo(target, prop, { duration, ease: "power2.out" }) as unknown as QuickToFn;

    const qt: Partial<Record<string, QuickToFn>> = {};
    if (REF.horse) {
      qt.horseSkew = smooth(REF.horse, "skewX");
      qt.horseX = smooth(REF.horse, "x");
      qt.horseHeight = smooth(REF.horse, "height");
    }
    if (REF.cat) {
      qt.catSkew = smooth(REF.cat, "skewX");
      qt.catX = smooth(REF.cat, "x");
    }
    if (REF.cow) {
      qt.cowSkew = smooth(REF.cow, "skewX");
    }
    if (REF.dog) {
      qt.dogSkew = smooth(REF.dog, "skewX");
    }
    if (FACE_REF.horse) {
      qt.horseFaceLeft = smooth(FACE_REF.horse, "left");
      qt.horseFaceTop = smooth(FACE_REF.horse, "top");
      qt.horseEyeGap = smooth(FACE_REF.horse, "gap");
    }
    if (FACE_REF.cat) {
      qt.catFaceLeft = smooth(FACE_REF.cat, "left");
      qt.catFaceTop = smooth(FACE_REF.cat, "top");
    }
    if (FACE_REF.cow) {
      qt.cowFaceLeft = smooth(FACE_REF.cow, "left", 0.2);
      qt.cowFaceTop = smooth(FACE_REF.cow, "top", 0.2);
    }
    if (FACE_REF.dog) {
      qt.dogFaceLeft = smooth(FACE_REF.dog, "left", 0.2);
      qt.dogFaceTop = smooth(FACE_REF.dog, "top", 0.2);
      qt.dogEyeGap = smooth(FACE_REF.dog, "gap");
    }
    quickToRef.current = qt;

    const calcPos = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 3;
      const dx = mouseRef.current.x - cx;
      const dy = mouseRef.current.y - cy;
      return {
        faceX: Math.max(-15, Math.min(15, dx / 20)),
        faceY: Math.max(-10, Math.min(10, dy / 30)),
        bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
      };
    };

    const calcEyePos = (el: HTMLElement, maxDist: number) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mouseRef.current.x - cx;
      const dy = mouseRef.current.y - cy;
      const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDist);
      const angle = Math.atan2(dy, dx);
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
    };

    let rafId = 0;

    const tick = () => {
      const container = containerRef.current;
      if (!container) return;

      const {
        isTyping: typing,
        isHidingPassword: hiding,
        isShowingPassword: showing,
        isLooking: looking,
      } = stateRef.current;

      const m = mirrorRef.current;

      if (horseRef.current && !showing) {
        const hp = calcPos(horseRef.current);
        if (typing || hiding) {
          qt.horseSkew?.((hp.bodySkew - 12) * m);
          qt.horseX?.(40 * m);
          qt.horseHeight?.(HORSE_HEIGHT_STRETCHED);
        } else {
          qt.horseSkew?.(hp.bodySkew * m);
          qt.horseX?.(0);
          qt.horseHeight?.(HORSE_HEIGHT);
        }
      }

      if (catRef.current && !showing) {
        const cp = calcPos(catRef.current);
        if (looking) {
          qt.catSkew?.((cp.bodySkew * 1.5 + 10) * m);
          qt.catX?.(20 * m);
        } else if (typing || hiding) {
          qt.catSkew?.(cp.bodySkew * 1.5 * m);
          qt.catX?.(0);
        } else {
          qt.catSkew?.(cp.bodySkew * m);
          qt.catX?.(0);
        }
      }

      if (cowRef.current && !showing) {
        qt.cowSkew?.(calcPos(cowRef.current).bodySkew * m);
      }

      if (dogRef.current && !showing) {
        qt.dogSkew?.(calcPos(dogRef.current).bodySkew * m);
      }

      if (horseRef.current && !showing && !looking) {
        const hp = calcPos(horseRef.current);
        qt.horseFaceLeft?.(FACE.horse.left + hp.faceX * FACE_TRAVEL.horse * m);
        qt.horseFaceTop?.(FACE.horse.top + hp.faceY * FACE_TRAVEL.horse);
      }

      if (catRef.current && !showing && !looking) {
        const cp = calcPos(catRef.current);
        qt.catFaceLeft?.(FACE.cat.left + cp.faceX * FACE_TRAVEL.cat * m);
        qt.catFaceTop?.(FACE.cat.top + cp.faceY * FACE_TRAVEL.cat);
      }

      if (cowRef.current && !showing) {
        const cp = calcPos(cowRef.current);
        qt.cowFaceLeft?.(FACE.cow.left + cp.faceX * FACE_TRAVEL.cow * m);
        qt.cowFaceTop?.(FACE.cow.top + cp.faceY * FACE_TRAVEL.cow);
      }

      if (dogRef.current && !showing) {
        const dp = calcPos(dogRef.current);
        qt.dogFaceLeft?.(FACE.dog.left + dp.faceX * FACE_TRAVEL.dog * m);
        qt.dogFaceTop?.(FACE.dog.top + dp.faceY * FACE_TRAVEL.dog);
      }

      if (!showing) {
        container.querySelectorAll<HTMLElement>(".pupil").forEach((el) => {
          if (looking && (horseRef.current?.contains(el) || catRef.current?.contains(el))) return;
          const maxDist = Number(el.dataset.maxDistance) || 5;
          const ePos = calcEyePos(el, maxDist);
          gsap.set(el, { x: ePos.x * m, y: ePos.y });
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [shown.horse, shown.cat, shown.cow, shown.dog]);

  useEffect(() => {
    if (!entrance) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = [cowRef.current, horseRef.current, catRef.current, dogRef.current].filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (mirrored) targets.reverse();
    if (!targets.length) return;

    const tween = gsap.fromTo(
      targets,
      { yPercent: 125 },
      { yPercent: 0, duration: 1, ease: "back.out(1.3)", stagger: 0.13, delay: 0.15 }
    );

    return () => {
      tween.kill();
      gsap.set(targets, { yPercent: 0 });
    };
  }, [entrance, mirrored, shown.horse, shown.cat, shown.cow, shown.dog]);

  useEffect(() => {
    const blinkHandles: { t?: ReturnType<typeof setTimeout> }[] = [];

    const startBlinking = (host: HTMLElement | null) => {
      const pupils = host?.querySelectorAll<HTMLElement>(".pupil");
      if (!pupils?.length) return;

      const handle: { t?: ReturnType<typeof setTimeout> } = {};
      blinkHandles.push(handle);

      const nextDelay = () => Math.random() * 4000 + 2500;

      const open = () => {
        pupils.forEach((el) => gsap.to(el, { scaleY: 1, duration: 0.09, ease: "power2.out" }));
        handle.t = setTimeout(close, nextDelay());
      };
      const close = () => {
        pupils.forEach((el) => gsap.to(el, { scaleY: 0.12, duration: 0.07, ease: "power2.in" }));
        handle.t = setTimeout(open, 120);
      };

      handle.t = setTimeout(close, nextDelay());
    };

    startBlinking(horseRef.current);
    startBlinking(catRef.current);
    startBlinking(cowRef.current);
    startBlinking(dogRef.current);

    return () => blinkHandles.forEach((h) => clearTimeout(h.t));
  }, [shown.horse, shown.cat, shown.cow, shown.dog]);

  useEffect(() => {
    if (!isShowingPassword || passwordLength <= 0) {
      clearTimeout(horsePeekTimerRef.current);
      return;
    }
    if (!horseRef.current?.querySelector(".pupil")) return;

    let innerTimer: ReturnType<typeof setTimeout> | undefined;

    const schedulePeek = () => {
      horsePeekTimerRef.current = setTimeout(() => {
        movePupils(horseRef.current, 4, 5);
        setFace("horse", POSE.show.horse);

        innerTimer = setTimeout(() => {
          movePupils(horseRef.current, -4, -4);
          schedulePeek();
        }, 800);
      }, Math.random() * 3000 + 2000);
    };

    schedulePeek();

    return () => {
      clearTimeout(horsePeekTimerRef.current);
      clearTimeout(innerTimer);
    };
  }, [isShowingPassword, passwordLength]);

  useEffect(() => {
    if (isTyping && !isShowingPassword) {
      stateRef.current.isLooking = true;
      applyLookAtEachOther();

      clearTimeout(lookingTimerRef.current);
      lookingTimerRef.current = setTimeout(() => {
        stateRef.current.isLooking = false;
        horseRef.current?.querySelectorAll<HTMLElement>(".pupil").forEach((p) => gsap.killTweensOf(p));
      }, 800);
    } else {
      clearTimeout(lookingTimerRef.current);
      stateRef.current.isLooking = false;
    }

    return () => clearTimeout(lookingTimerRef.current);
  }, [isTyping, isShowingPassword]);

  useEffect(() => {
    if (isShowingPassword) {
      applyShowPassword();
    } else {
      resetEyeGap();
      if (isHidingPassword) {
        applyHidingPassword();
      }
    }
  }, [isShowingPassword, isHidingPassword]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: `${groupWidth}px`,
        height: `${HORSE_HEIGHT}px`,
        transform: mirrored ? "scaleX(-1)" : undefined,
      }}
    >
      {shown.horse && (
        <div
          ref={horseRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${packedLeft("horse")}px`,
            width: `${LAYOUT.horse.width}px`,
            height: `${HORSE_HEIGHT}px`,
            zIndex: LAYOUT.horse.zIndex,
            transformOrigin: "bottom center",
            willChange: "transform",
          }}
        >
          <HorseBody />
          <div ref={horseFaceRef} style={faceStyle(FACE.horse, HORSE_EYE_GAP)}>
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
          </div>
        </div>
      )}

      {shown.cat && (
        <div
          ref={catRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${packedLeft("cat")}px`,
            width: `${LAYOUT.cat.width}px`,
            height: `${LAYOUT.cat.height}px`,
            zIndex: LAYOUT.cat.zIndex,
            transformOrigin: "bottom center",
            willChange: "transform",
          }}
        >
          <CatBody />
          <div ref={catFaceRef} style={faceStyle(FACE.cat, 34)}>
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
          </div>
        </div>
      )}

      {shown.cow && (
        <div
          ref={cowRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${packedLeft("cow")}px`,
            width: `${LAYOUT.cow.width}px`,
            height: `${LAYOUT.cow.height}px`,
            zIndex: LAYOUT.cow.zIndex,
            transformOrigin: "bottom center",
            willChange: "transform",
          }}
        >
          <CowBody />
          <div ref={cowFaceRef} style={faceStyle(FACE.cow, 40)}>
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
          </div>
        </div>
      )}

      {shown.dog && (
        <div
          ref={dogRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${packedLeft("dog")}px`,
            width: `${LAYOUT.dog.width}px`,
            height: `${LAYOUT.dog.height}px`,
            zIndex: LAYOUT.dog.zIndex,
            transformOrigin: "bottom center",
            willChange: "transform",
          }}
        >
          <DogBody />
          <div ref={dogFaceRef} style={faceStyle(FACE.dog, DOG_EYE_GAP)}>
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
            <Pupil size="18px" maxDistance={6} pupilColor={EYE} />
          </div>
        </div>
      )}
    </div>
  );
}
