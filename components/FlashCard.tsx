'use client';

import { useEffect, useMemo, useState, memo, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';

export type FlashCardData = {
  id: string;
  title: string;
  image: string;
  definition: string;
  flavor: string;
  merits: string[];
  demerits: string[];
  whyUs: string[];
};

export type CardState = 'active' | 'near' | 'inactive';

interface FlashCardProps {
  card: FlashCardData;
  state: CardState;
  index: number;
  onFocus: (index: number) => void;
}

const cardVariants: Variants = {
  active: {
    opacity: 1,
    scale: 1,
    boxShadow: '0 8px 30px rgba(3,10,25,0.35), 0 3px 10px rgba(30,144,255,0.06)',
    transition: { type: 'spring', stiffness: 170, damping: 22 },
  },
  near: {
    opacity: 0.6,
    scale: 0.97,
    boxShadow: '0 6px 22px rgba(3,10,25,0.28), 0 2px 8px rgba(30,144,255,0.04)',
    transition: { type: 'spring', stiffness: 150, damping: 24 },
  },
  inactive: {
    opacity: 0.3,
    scale: 0.93,
    boxShadow: 'none',
    transition: { duration: 0.18 },
  },
};

const sweepVariants: Variants = {
  hidden: { opacity: 0, x: '-30%' },
  sweep: {
    opacity: [0, 0.4, 0],
    x: ['-30%', '70%', '90%'],
    transition: { duration: 0.22, ease: 'easeOut' },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } },
};

const backVariants: Variants = {
  enter: { rotateY: -180, opacity: 0 },
  center: { rotateY: 0, opacity: 1, transition: { duration: 0.52, ease: 'easeInOut' } },
  exit: { rotateY: 180, opacity: 0, transition: { duration: 0.28 } },
};

const frontVariants: Variants = {
  enter: { rotateY: 180, opacity: 0 },
  center: { rotateY: 0, opacity: 1, transition: { duration: 0.52, ease: 'easeInOut' } },
  exit: { rotateY: -180, opacity: 0, transition: { duration: 0.28 } },
};

const reducedFlipVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function FlashCard({ card, state, index, onFocus }: FlashCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [flashKey, setFlashKey] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (state === 'active') {
      setFlashKey((prev) => prev + 1);
    }
    if (state !== 'active') setFlipped(false);
  }, [state]);

  const pointerClass = useMemo(() => (state === 'inactive' ? 'pointer-events-none' : 'pointer-events-auto'), [state]);

  const handleFlip = () => {
    if (state === 'inactive') return;
    setFlipped((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (state === 'inactive') return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFlip();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || state === 'inactive') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: -y * 6 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const shimmerClass = shouldReduceMotion ? '' : 'badge-shimmer';
  const flipFront = shouldReduceMotion ? reducedFlipVariants : frontVariants;
  const flipBack = shouldReduceMotion ? reducedFlipVariants : backVariants;

  return (
    <motion.article
      className={`flash-card card-shell relative isolate overflow-hidden rounded-[20px] border border-white/8 bg-[#0b1220] ${pointerClass}`}
      variants={cardVariants}
      initial="inactive"
      animate={state}
      layout
      tabIndex={state === 'inactive' ? -1 : 0}
      onFocus={() => onFocus(index)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest('button,a')) return;
        handleFlip();
      }}
      style={{ perspective: 1600, rotateX: tilt.y, rotateY: tilt.x }}
      role="group"
      aria-roledescription="Interactive feature card"
    >
      <div className="card-glow" aria-hidden />
      <div className="card-rail-shadow" aria-hidden />

      <AnimatePresence mode="wait">
        {state === 'active' && !shouldReduceMotion && (
          <motion.div
            key={`flash-${flashKey}`}
            className="flash-sweep"
            variants={sweepVariants}
            initial="hidden"
            animate="sweep"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      <div className="sparkle-overlay" aria-hidden />

      <motion.div
        className={`card-inner ${flipped ? 'is-flipped' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence initial={false}>
          {!flipped && (
            <motion.div
              key="front"
              className="card-face front"
              variants={flipFront}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div
                className="relative flex h-full flex-col gap-4 text-sky-50"
                variants={contentVariants}
                initial="hidden"
                animate={state === 'active' ? 'visible' : 'hidden'}
              >
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                  <span className={`badge-pill ${shimmerClass}`}>{card.flavor}</span>
                  <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-sky-100/90">
                    <span aria-hidden>⬈</span>
                    Premium workspace
                  </span>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="ml-auto text-[11px] font-bold text-sky-100/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
                    aria-label={`Flip ${card.title} card to see details`}
                  >
                    Flip ↺
                  </button>
                </div>

                <motion.p className="text-[13px] font-semibold tracking-[0.16em] text-sky-200/75" variants={itemVariants}>
                  {card.definition.substring(0, 30)}...
                </motion.p>
                <motion.h3
                  id={`card-${card.id}`}
                  className="text-[30px] font-extrabold leading-[1.05] tracking-tight text-white text-shadow-subtle"
                  variants={itemVariants}
                >
                  {card.title}
                </motion.h3>
                <motion.p className="max-w-2xl text-[15px] leading-relaxed text-sky-100/90" variants={itemVariants}>
                  {card.definition}
                </motion.p>

                <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
                  <motion.span
                    className="chip glass" variants={tagVariants}>
                    Merits • {card.merits.length}
                  </motion.span>
                  <motion.span className="chip glass" variants={tagVariants}>
                    Demerits • {card.demerits.length}
                  </motion.span>
                  <motion.span className="chip glass" variants={tagVariants}>
                    Why us • {card.whyUs.length}
                  </motion.span>
                </motion.div>

                <motion.div className="mt-auto flex items-end justify-between" variants={itemVariants}>
                  <div className="flex flex-col gap-2 text-xs text-sky-100/70">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 font-semibold text-sky-100">
                      <span aria-hidden>⇵</span> Scroll or tap to reveal
                    </span>
                    <span className="text-[12px] text-sky-100/70">Example: See demo</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="cta-pill"
                  >
                    <span>Learn more</span>
                    <span aria-hidden>↗</span>
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {flipped && (
            <motion.div
              key="back"
              className="card-face back"
              variants={flipBack}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="glass-panel">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/85">
                  <span className="badge-pill bg-white/10 text-white">Details</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-sky-100">Live ops snapshot</span>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="ml-auto rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-sky-50 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
                    aria-label={`Return to ${card.title} front`}
                  >
                    Back ↺
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 text-sky-50 sm:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold">Merits</h4>
                    <ul className="space-y-2 text-[15px] text-sky-100/90">
                      {card.merits.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden>✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold">Demerits</h4>
                    <ul className="space-y-2 text-[15px] text-sky-100/90">
                      {card.demerits.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <h4 className="text-lg font-bold">Why Us</h4>
                    <ul className="grid grid-cols-1 gap-2 text-[15px] text-sky-100/90 sm:grid-cols-3">
                      {card.whyUs.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden>›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="rounded-2xl bg-white/5 px-4 py-3 text-[15px] text-sky-50 shadow-inner shadow-sky-900/40">
                      <div className="text-[12px] uppercase tracking-[0.16em] text-sky-200/80">Example</div>
                      <div className="mt-1 font-semibold text-sky-50/95">See demo</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-[13px] text-sky-100/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 font-semibold text-white">
                    <span aria-hidden>⚡</span>
                    Instant activation when added to your workspace
                  </span>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="cta-pill subtle"
                  >
                    <span>Back to front</span>
                    <span aria-hidden>↺</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
}

export default memo(FlashCard);
