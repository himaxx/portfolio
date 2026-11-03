import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

import usePrefersReducedMotion from "./usePrefersReducedMotion";

// 3D tilt toward the pointer with a moving glare highlight.
const TiltCard = ({ children, className = "", max = 12, glare = true, ...rest }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const go = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const sgo = useSpring(go, { stiffness: 200, damping: 30 });
  const bg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,0.14), transparent 45%)`;

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    go.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    go.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className='h-full'>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className={`relative ${className}`}
        {...rest}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden='true'
            style={{ background: bg, opacity: sgo }}
            className='pointer-events-none absolute inset-0 rounded-[inherit]'
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard;
