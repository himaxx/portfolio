import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden='true'
      style={{ scaleX }}
      className='fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-[#00cea8] via-[#915EFF] to-[#bf61ff]'
    />
  );
};

export default ScrollProgress;
