import React, { useEffect, useRef, useState } from "react";

import usePrefersReducedMotion from "./usePrefersReducedMotion";

const FINE = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a, button, [data-cursor], input, textarea, label";

// A soft spotlight that follows the pointer, plus a trailing ring that
// morphs over interactive elements. Desktop pointers only.
const CursorFX = () => {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia(FINE);
    const on = () => setEnabled(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;
    let shown = false;

    const classify = (el) => {
      const t = el instanceof Element ? el.closest(INTERACTIVE) : null;
      const isText = t && (t.matches("input, textarea") || t.closest("label"));
      const text = (!isText && t?.getAttribute?.("data-cursor")) || "";
      const r = ring.current;
      if (!r) return;
      r.classList.toggle("is-hover", Boolean(t) && !isText);
      r.classList.toggle("is-text", Boolean(isText));
      r.classList.toggle("has-label", Boolean(text));
      if (label.current) label.current.textContent = text;
    };

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      root.style.setProperty("--mx", `${mx}px`);
      root.style.setProperty("--my", `${my}px`);
      if (!shown && ring.current) {
        ring.current.style.opacity = "1";
        shown = true;
      }
      classify(e.target);
    };
    // Content moves under a still pointer while scrolling: re-check it.
    const onScroll = () => {
      if (shown) classify(document.elementFromPoint(mx, my));
    };
    const leave = () => {
      if (ring.current) ring.current.style.opacity = "0";
      shown = false;
    };
    const down = () => ring.current?.classList.add("is-down");
    const up = () => ring.current?.classList.remove("is-down");

    const tick = () => {
      const k = reduced ? 1 : 0.2;
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;
  return (
    <>
      <div aria-hidden='true' className='cursor-spotlight' />
      <div aria-hidden='true' ref={ring} className='cursor-ring' style={{ opacity: 0 }}>
        <span ref={label} className='cursor-label' />
      </div>
    </>
  );
};

export default CursorFX;
