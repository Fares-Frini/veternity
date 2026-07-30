"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import Pupil from "./Pupil";
import HorseBody from "./bodies/Horse";
import CatBody from "./bodies/Cat";
import CowBody from "./bodies/Cow";
import DogBody from "./bodies/Dog";

interface AnimatedCharactersProps {
  isTyping?: boolean;
  showPassword?: boolean;
  passwordLength?: number;
}

type Who = "horse" | "cat" | "cow" | "dog";

const EYE = "#1F1F1F";

/** Each animal's base eye position within its own body (px, same coordinate space as its SVG viewBox) */
const FACE: Record<Who, { left: number; top: number }> = {
  horse: { left: 120, top: 90 },
  cat: { left: 68, top: 69 },
  cow: { left: 130, top: 104 },
  dog: { left: 75, top: 38 },
};

/**
 * How far each animal's eyes drift with the cursor, as a fraction of the full
 * ±15px / ±10px range from calcPos(). Horse and cow have the least head margin
 * around their eyes, so they travel less to avoid sliding off the face.
 */
const FACE_TRAVEL: Record<Who, number> = { horse: 0.5, cat: 1, cow: 0.5, dog: 1 };

/** Face offset from the base position for each state */
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

/** Resting gap between the two eyes, and how tight they draw together while the password is shown */
const HORSE_EYE_GAP = 22;
const HORSE_EYE_GAP_SHOW = 10;
const DOG_EYE_GAP = 30;
const DOG_EYE_GAP_SHOW = 16;

const HORSE_HEIGHT = 420;
const HORSE_HEIGHT_STRETCHED = 465;

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
}: AnimatedCharactersProps) {
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
  const quickToRef = useRef<Record<string, QuickToFn> | null>(null);

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

  const setFace = (who: Who, [dx, dy]: readonly [number, number]) => {
    const qt = quickToRef.current;
    if (!qt) return;
    const base = FACE[who];
    qt[`${who}FaceLeft`](base.left + dx);
    qt[`${who}FaceTop`](base.top + dy);
  };

  const movePupils = (host: HTMLElement | null, x: number, y: number) => {
    host?.querySelectorAll<HTMLElement>(".pupil").forEach((p) => {
      gsap.to(p, { x, y, duration: 0.3, ease: "power2.out", overwrite: "auto" });
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
      qt.horseSkew(0);
      qt.catSkew(0);
      qt.cowSkew(0);
      qt.dogSkew(0);
      qt.horseX(0);
      qt.catX(0);
      qt.horseHeight(HORSE_HEIGHT);
      qt.horseEyeGap(HORSE_EYE_GAP_SHOW);
      qt.dogEyeGap(DOG_EYE_GAP_SHOW);
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
    qt.horseEyeGap(HORSE_EYE_GAP);
    qt.dogEyeGap(DOG_EYE_GAP);
  };

  // Set up quickTo instances, the cursor-tracking rAF loop, and the mousemove listener.
  useEffect(() => {
    if (
      !horseRef.current ||
      !catRef.current ||
      !cowRef.current ||
      !dogRef.current ||
      !horseFaceRef.current ||
      !catFaceRef.current ||
      !cowFaceRef.current ||
      !dogFaceRef.current
    )
      return;

    gsap.set(".pupil", { x: 0, y: 0 });

    const smooth = (target: HTMLElement, prop: string, duration = 0.3) =>
      gsap.quickTo(target, prop, { duration, ease: "power2.out" }) as unknown as QuickToFn;

    const qt: Record<string, QuickToFn> = {
      horseSkew: smooth(horseRef.current, "skewX"),
      catSkew: smooth(catRef.current, "skewX"),
      cowSkew: smooth(cowRef.current, "skewX"),
      dogSkew: smooth(dogRef.current, "skewX"),
      horseX: smooth(horseRef.current, "x"),
      catX: smooth(catRef.current, "x"),
      horseHeight: smooth(horseRef.current, "height"),
      horseFaceLeft: smooth(horseFaceRef.current, "left"),
      horseFaceTop: smooth(horseFaceRef.current, "top"),
      catFaceLeft: smooth(catFaceRef.current, "left"),
      catFaceTop: smooth(catFaceRef.current, "top"),
      cowFaceLeft: smooth(cowFaceRef.current, "left", 0.2),
      cowFaceTop: smooth(cowFaceRef.current, "top", 0.2),
      dogFaceLeft: smooth(dogFaceRef.current, "left", 0.2),
      dogFaceTop: smooth(dogFaceRef.current, "top", 0.2),
      horseEyeGap: smooth(horseFaceRef.current, "gap"),
      dogEyeGap: smooth(dogFaceRef.current, "gap"),
    };
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

      if (horseRef.current && !showing) {
        const hp = calcPos(horseRef.current);
        if (typing || hiding) {
          qt.horseSkew(hp.bodySkew - 12);
          qt.horseX(40);
          qt.horseHeight(HORSE_HEIGHT_STRETCHED);
        } else {
          qt.horseSkew(hp.bodySkew);
          qt.horseX(0);
          qt.horseHeight(HORSE_HEIGHT);
        }
      }

      if (catRef.current && !showing) {
        const cp = calcPos(catRef.current);
        if (looking) {
          qt.catSkew(cp.bodySkew * 1.5 + 10);
          qt.catX(20);
        } else if (typing || hiding) {
          qt.catSkew(cp.bodySkew * 1.5);
          qt.catX(0);
        } else {
          qt.catSkew(cp.bodySkew);
          qt.catX(0);
        }
      }

      if (cowRef.current && !showing) {
        qt.cowSkew(calcPos(cowRef.current).bodySkew);
      }

      if (dogRef.current && !showing) {
        qt.dogSkew(calcPos(dogRef.current).bodySkew);
      }

      if (horseRef.current && !showing && !looking) {
        const hp = calcPos(horseRef.current);
        qt.horseFaceLeft(FACE.horse.left + hp.faceX * FACE_TRAVEL.horse);
        qt.horseFaceTop(FACE.horse.top + hp.faceY * FACE_TRAVEL.horse);
      }

      if (catRef.current && !showing && !looking) {
        const cp = calcPos(catRef.current);
        qt.catFaceLeft(FACE.cat.left + cp.faceX * FACE_TRAVEL.cat);
        qt.catFaceTop(FACE.cat.top + cp.faceY * FACE_TRAVEL.cat);
      }

      if (cowRef.current && !showing) {
        const cp = calcPos(cowRef.current);
        qt.cowFaceLeft(FACE.cow.left + cp.faceX * FACE_TRAVEL.cow);
        qt.cowFaceTop(FACE.cow.top + cp.faceY * FACE_TRAVEL.cow);
      }

      if (dogRef.current && !showing) {
        const dp = calcPos(dogRef.current);
        qt.dogFaceLeft(FACE.dog.left + dp.faceX * FACE_TRAVEL.dog);
        qt.dogFaceTop(FACE.dog.top + dp.faceY * FACE_TRAVEL.dog);
      }

      if (!showing) {
        container.querySelectorAll<HTMLElement>(".pupil").forEach((el) => {
          // While looking at each other, the horse's and cat's eyes are driven by applyLookAtEachOther
          if (looking && (horseRef.current?.contains(el) || catRef.current?.contains(el))) return;
          const maxDist = Number(el.dataset.maxDistance) || 5;
          const ePos = calcEyePos(el, maxDist);
          gsap.set(el, { x: ePos.x, y: ePos.y });
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
  }, []);

  /** Blinking: dot-shaped eyes blink by squashing the vertical scale */
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
  }, []);

  // Password peek effect: while the password is shown, the horse periodically peeks at it
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

  // Horse and cat look at each other while typing
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, isShowingPassword]);

  // Password state effects
  useEffect(() => {
    if (isShowingPassword) {
      applyShowPassword();
    } else {
      resetEyeGap();
      if (isHidingPassword) {
        applyHidingPassword();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowingPassword, isHidingPassword]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "555px", height: `${HORSE_HEIGHT}px` }}>
      {/* Horse */}
      <div
        ref={horseRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "105px",
          width: "233px",
          height: `${HORSE_HEIGHT}px`,
          zIndex: 1,
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

      {/* Cat */}
      <div
        ref={catRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "235px",
          width: "207px",
          height: "250px",
          zIndex: 2,
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

      {/* Cow */}
      <div
        ref={cowRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "243px",
          height: "235px",
          zIndex: 3,
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

      {/* Dog */}
      <div
        ref={dogRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "375px",
          width: "180px",
          height: "183px",
          zIndex: 4,
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
    </div>
  );
}
