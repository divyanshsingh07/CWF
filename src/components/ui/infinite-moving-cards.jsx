"use client";

import React from "react";
import { motion } from "framer-motion";

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  cardWidth = "w-80",
  gapSize = "gap-6",
}) {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);

  const getSpeed = () => {
    switch (speed) {
      case "fast": return 15;
      case "normal": return 30;
      case "slow": return 45;
      default: return 30;
    }
  };

  const getDirection = () => {
    switch (direction) {
      case "left": return 1;
      case "right": return -1;
      default: return 1;
    }
  };

  const getCardWidth = () => {
    const widthMap = {
      'w-64': 256,
      'w-72': 288,
      'w-80': 320,
      'w-96': 384,
    };
    return widthMap[cardWidth] || widthMap['w-80'];
  };

  const getGapSize = () => {
    const gapMap = {
      'gap-4': 16,
      'gap-6': 24,
      'gap-8': 32,
      'gap-10': 40,
    };
    return gapMap[gapSize] || gapMap['gap-6'];
  };

  const cardPixelWidth = getCardWidth();
  const gap = getGapSize();

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden py-4 sm:py-6 lg:py-8 ${className}`}
    >
      {/* Gradient fade effect on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-linear-to-r from-white via-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-linear-to-l from-white via-white to-transparent z-10 pointer-events-none" />
      
      {/* Subtle background shine effect */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-cyan-50/30 via-transparent to-violet-50/30" />

      <motion.div
        ref={scrollerRef}
        animate={{
          x: getDirection() > 0 ? [0, -(cardPixelWidth + gap) * items.length] : [0, (cardPixelWidth + gap) * items.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: isPaused ? 60 : getSpeed(),
            ease: "linear",
          },
        }}
        className={`flex ${gapSize} min-w-max`}
        onHoverStart={pauseOnHover ? () => setIsPaused(true) : undefined}
        onHoverEnd={pauseOnHover ? () => setIsPaused(false) : undefined}
      >
        {/* First set */}
        {items.map((item, idx) => (
          <div
            key={`first-${idx}`}
            className={`shrink-0 ${cardWidth}`}
          >
            {item}
          </div>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {items.map((item, idx) => (
          <div
            key={`second-${idx}`}
            className={`shrink-0 ${cardWidth}`}
          >
            {item}
          </div>
        ))}
        
        {/* Third set for extra smoothness */}
        {items.map((item, idx) => (
          <div
            key={`third-${idx}`}
            className={`shrink-0 ${cardWidth}`}
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
