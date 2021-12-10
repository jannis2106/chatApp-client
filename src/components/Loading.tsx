import React from "react";
import { motion } from "framer-motion";
import "../sass/loading.sass";

export const Loading = () => {
  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const loadingCircleVariants = {
    start: {
      y: "50%",
    },
    end: {
      y: "150%",
    },
  };

  const loadingCircleTransition = {
    duration: 0.5,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <div className="loading">
      <motion.div
        className="loadingContainer"
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        <motion.span
          className="loadingCircle"
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        <motion.span
          className="loadingCircle"
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        <motion.span
          className="loadingCircle"
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
      </motion.div>
    </div>
  );
};
