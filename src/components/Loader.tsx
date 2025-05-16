"use client";

import { motion } from "framer-motion";

const LoadingDots = () => {
  const bounceTransition = {
    y: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
    opacity: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-emerald-600"
          animate={{
            y: [0, -6, 0],
            opacity: [1, 0.4, 1],
          }}
          transition={{
            ...bounceTransition,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
