import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import usePrefersReducedMotion from "./usePrefersReducedMotion";

// Inertial smooth scrolling. In-page anchor links (#about, #stack…) glide too.
const SmoothScroll = () => {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  return null;
};

export default SmoothScroll;
