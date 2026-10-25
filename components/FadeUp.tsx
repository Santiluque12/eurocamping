"use client";

import { motion } from "framer-motion";

const TAGS = { p: motion.p, h1: motion.h1, div: motion.div } as const;

export default function FadeUp({
  as = "div",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: keyof typeof TAGS;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </Tag>
  );
}
