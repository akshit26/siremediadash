'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

export type FlashCardData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type CardState = 'active' | 'near' | 'inactive';

interface FlashCardProps {
  card: FlashCardData;
  state: CardState;
  onFocus: () => void;
}

const cardVariants: Variants = {
  active: {
    opacity: 1,
    scale: 1,
    boxShadow: '0 28px 120px rgba(64, 123, 255, 0.28)',
    transition: { type: 'spring', stiffness: 160, damping: 24 },
  },
  near: {
    opacity: 0.6,
    scale: 0.97,
    boxShadow: '0 16px 60px rgba(64, 123, 255, 0.18)',
    transition: { type: 'spring', stiffness: 150, damping: 26 },
  },
  inactive: {
    opacity: 0.3,
    scale: 0.93,
    boxShadow: 'none',
    transition: { duration: 0.2 },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

const flashVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  flash: {
    opacity: [0, 0.45, 0],
    scale: [0.96, 1.06, 1],
    transition: { duration: 0.22, ease: 'easeOut' },
  },
};

export default function FlashCard({ card, state, onFocus }: FlashCardProps) {
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (state === 'active') {
      setFlashKey((prev) => prev + 1);
    }
  }, [state]);

  const pointerClass = useMemo(() => (state === 'inactive' ? 'pointer-events-none' : 'pointer-events-auto'), [state]);

  return (
    <motion.article
      className={`flash-card gradient-border relative isolate overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-8 backdrop-blur-xl ${pointerClass}`}
      variants={cardVariants}
      initial="inactive"
      animate={state}
      layout
      tabIndex={state === 'inactive' ? -1 : 0}
      onFocus={onFocus}
    >
      <AnimatePresence mode="popLayout">
        {state === 'active' && (
          <motion.div
            key={flashKey}
            className="flash-overlay"
            variants={flashVariants}
            initial="initial"
            animate="flash"
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-x-6 top-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200/80">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/15 text-sm text-sky-100">★</span>
        Premium Workflow
      </div>

      <motion.div
        className="relative mt-10 flex flex-col gap-4 text-sky-50"
        variants={contentVariants}
        initial="hidden"
        animate={state === 'active' ? 'visible' : 'hidden'}
      >
        <motion.h3 className="text-2xl font-bold leading-tight tracking-tight" variants={itemVariants}>
          {card.title}
        </motion.h3>
        <motion.p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200" variants={itemVariants}>
          {card.subtitle}
        </motion.p>
        <motion.p className="max-w-2xl text-base leading-relaxed text-sky-100/90" variants={itemVariants}>
          {card.description}
        </motion.p>
        <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
          {card.tags.map((tag) => (
            <motion.span
              key={tag}
              className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-100"
              variants={tagVariants}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
        <motion.a
          href={card.ctaHref}
          className="group inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(56,134,255,0.35)] transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          variants={itemVariants}
        >
          {card.ctaLabel}
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </motion.a>
      </motion.div>
    </motion.article>
  );
}
