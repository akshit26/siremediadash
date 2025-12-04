'use client';

import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useAnimation,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import whyUsCards from '../data/section3WhyUs.json';

type WhyUsCard = {
  id: string;
  title: string;
  label: string;
  image: string;
  merits: string[];
  demerits: string;
  whyUs: string[];
};

type ProcessStep = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
};

const phrases = ['Creator-first workflows', 'Data-backed decisions', 'Deliverables that ship'];

const featureCards = [
  {
    id: 'intelligence',
    title: 'Creator Intelligence',
    copy: 'Curated, verified creators.',
    badgeLabel: '1,240 creators',
    badgeType: 'count' as const,
    target: 1240,
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    copy: 'We run campaigns on our dashboard.',
    badgeLabel: 'Ops time ↓ 45%',
    badgeType: 'delta' as const,
    target: 45,
  },
  {
    id: 'ops',
    title: 'High-Performance Ops',
    copy: 'Dedicated Ops + SLAs.',
    badgeLabel: 'SLA: 48h response',
    badgeType: 'pulse' as const,
    target: 48,
  },
  {
    id: 'creative',
    title: 'Creative Strategy',
    copy: 'UGC-led concepts that perform.',
    badgeLabel: 'Avg ER: 6.2%',
    badgeType: 'average' as const,
    target: 6.2,
  },
];

const processSteps: ProcessStep[] = [
  {
    id: 'discovery',
    title: 'Discovery & Fit',
    subtitle: 'We align goals, KPIs, audience.',
    bullets: ['Define KPIs + audience segments', 'Audit brand safety + tone', 'Roadmap creator selection'],
  },
  {
    id: 'blueprint',
    title: 'Blueprint',
    subtitle: 'Creators, deliverables, timeline, budget.',
    bullets: ['Shortlist creators with benchmarks', 'Map deliverables + timelines', 'Budget clarity with checkpoints'],
  },
  {
    id: 'execute',
    title: 'Execute & Approve',
    subtitle: 'Drafts → Approvals → Posting.',
    bullets: ['Draft + review workflows', 'Client approvals with receipts', 'Scheduling + go-live windows'],
  },
  {
    id: 'report',
    title: 'Report & Optimise',
    subtitle: 'Insights + recommendations.',
    bullets: ['Real-time dashboards + exports', 'Creative learnings + next tests', 'Performance huddles with Ops'],
  },
];

const pricing = [
  {
    id: 'project',
    title: 'Project-Based',
    bestFor: 'Brands testing a clear launch or drop.',
    bullets: ['Launch-ready squad in days', 'Approval-first milestones', 'Clear delivery timelines'],
    cta: 'Request Quote',
    range: '$8K - $18K per sprint',
  },
  {
    id: 'retainer',
    title: 'Retainer-Based',
    bestFor: 'Ongoing creator engine with monthly drops.',
    bullets: ['Dedicated Ops pod', 'Rolling creator sourcing', 'Monthly strategy cycles'],
    cta: 'Talk Retainer',
    range: '$12K - $28K / mo',
  },
  {
    id: 'performance',
    title: 'Performance Add-On',
    bestFor: 'When upside is tied to outcomes.',
    bullets: ['Aligned incentives', 'Transparent tracking', 'Optimisation sprints'],
    cta: 'Discuss Goals',
    range: 'Rev-share or hybrid',
  },
];

function useCounter(target: number, inView: boolean, duration = 0.8) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      setValue(target);
      return;
    }
    const animation = animate(motionValue, target, {
      duration,
      ease: 'easeOut',
    });

    const unsubscribe = motionValue.on('change', (v) => setValue(Number(v.toFixed(1))));
    return () => {
      animation?.stop();
      unsubscribe();
    };
  }, [inView, motionValue, shouldReduceMotion, target, duration]);

  return value;
}

function FeatureBadge({ type, target, inView }: { type: 'count' | 'delta' | 'pulse' | 'average'; target: number; inView: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();
  const count = useCounter(target, inView, type === 'average' ? 0.9 : 0.7);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) return;
    if (type === 'pulse') {
      void controls.start({ scale: [1, 1.08, 1], transition: { duration: 0.8, ease: 'easeOut' } });
    } else if (type === 'delta') {
      void controls.start({ opacity: [0, 1], y: [-6, 0], transition: { duration: 0.6, ease: 'easeOut' } });
    }
  }, [controls, inView, shouldReduceMotion, type]);

  const display = useMemo(() => {
    if (type === 'count') return `${Math.round(count).toLocaleString()} creators`;
    if (type === 'average') return `Avg ER: ${count.toFixed(1)}%`;
    if (type === 'pulse') return `SLA: ${Math.round(count)}h response`;
    return `Ops time ↓ ${Math.round(count)}%`;
  }, [count, type]);

  return (
    <motion.span
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100"
      animate={controls}
      aria-live="polite"
    >
      <span className="h-2 w-2 rounded-full bg-sky-300" />
      {display}
    </motion.span>
  );
}

function WhyUsCardItem({ card, index, shouldReduceMotion }: { card: WhyUsCard; index: number; shouldReduceMotion: boolean }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-5 shadow-2xl shadow-sky-950/40"
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : index * 0.06 }}
      whileHover={shouldReduceMotion ? undefined : { rotateX: 3, rotateY: -3, translateY: -6 }}
      style={{ transformStyle: 'preserve-3d' }}
      aria-label={`${card.title} card showing ${card.label}`}
    >
      <motion.button
        type="button"
        className="relative block h-full w-full"
        onClick={() => setFlipped((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setFlipped((prev) => !prev);
          }
        }}
        aria-pressed={flipped}
        style={{ perspective: '1200px' }}
      >
        <div className="relative h-full" aria-hidden={false}>
          <motion.div
            className="absolute inset-0 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-inner shadow-sky-900/30"
            animate={shouldReduceMotion ? { opacity: flipped ? 0 : 1 } : { rotateY: flipped ? 180 : 0, opacity: flipped ? 0 : 1 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.52, ease: 'easeInOut' }}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div
              className="aspect-[4/3] rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.4), rgba(15,23,42,0.6)), url(${card.image})`,
              }}
            />
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sky-100/80">
              <span>{card.label}</span>
              <span>Front</span>
            </div>
            <h4 className="mt-2 text-xl font-bold">{card.title}</h4>
            <p className="mt-1 text-sm text-sky-100/80">Reasons we obsess over {card.label.toLowerCase()}.</p>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-2xl border border-sky-200/30 bg-slate-900/80 p-4 shadow-inner shadow-sky-900/40"
            animate={shouldReduceMotion ? { opacity: flipped ? 1 : 0 } : { rotateY: flipped ? 0 : -180, opacity: flipped ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.52, ease: 'easeInOut' }}
            style={{ backfaceVisibility: 'hidden', transform: shouldReduceMotion ? undefined : 'rotateY(180deg)' }}
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sky-100/80">
              <span>Why Us</span>
              <span>Back</span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-sky-50/90">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Merits</p>
                <ul className="mt-2 space-y-1">
                  {card.merits.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Demerit</p>
                <p className="mt-1 rounded-lg bg-white/5 px-3 py-2 text-sky-100/80">{card.demerits}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Why Us</p>
                <ul className="mt-2 space-y-1">
                  {card.whyUs.map((reason) => (
                    <li key={reason} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" aria-hidden />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.button>
    </motion.article>
  );
}

export default function SectionThree() {
  const shouldReduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typed, setTyped] = useState(phrases[0]);
  const [showRanges, setShowRanges] = useState(false);
  const [activeStep, setActiveStep] = useState(processSteps[0].id);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTyped(phrases.join(' • '));
      return;
    }
    const current = phrases[phraseIndex];
    setTyped('');
    let charIndex = 0;
    const typingInterval = window.setInterval(() => {
      charIndex += 1;
      setTyped(current.slice(0, charIndex));
      if (charIndex >= current.length) {
        window.clearInterval(typingInterval);
        window.setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 900 + 240);
      }
    }, Math.max(12, 300 / Math.max(1, current.length)));

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [phraseIndex, shouldReduceMotion]);

  useEffect(() => {
    const region = liveRegionRef.current;
    if (!region) return;
    region.textContent = processSteps.find((s) => s.id === activeStep)?.title ?? '';
  }, [activeStep]);

  const activeProcess = processSteps.find((s) => s.id === activeStep) ?? processSteps[0];

  return (
    <section id="section-3" className="relative mt-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[10%] top-10 h-64 w-64 rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="absolute right-[6%] top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {/* Mini Hero */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-50 shadow-lg shadow-sky-900/30">
            Section 3 · Why Sire Media
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              How Sire Media Runs Creator Campaigns — Reliably. Transparently. Fast.
            </h2>
            <div className="relative h-9 overflow-hidden text-lg font-semibold text-sky-100 sm:text-xl">
              {shouldReduceMotion ? (
                <span>{phrases.join(' • ')}</span>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.24 } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.24 } }}
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    {typed}
                    <span className="ml-1 inline-block h-5 w-[2px] animate-pulse rounded-full bg-sky-200" aria-hidden />
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-800/40 transition hover:translate-y-[-2px] hover:shadow-blue-700/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
              Book Strategy Call
            </button>
            <button className="rounded-full border border-sky-200/50 bg-white/5 px-6 py-3 text-sm font-bold text-sky-50 shadow-lg shadow-sky-900/30 transition hover:bg-white/10 hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200">
              Request Roster Preview
            </button>
          </div>
        </div>

        {/* Feature Row */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Why Sire Media Works</p>
              <h3 className="text-2xl font-bold sm:text-3xl">Four pillars that keep campaigns predictable</h3>
            </div>
            <div className="hidden text-sm text-sky-100/80 md:block">Built for visibility, speed, and trust.</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card, index) => (
              <motion.article
                key={card.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-sky-950/40 backdrop-blur"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.08 }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                aria-label={`${card.title} — ${card.copy}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/20 text-sky-100 shadow-inner shadow-sky-500/40 transition duration-300 group-hover:shadow-sky-300/50">
                    <span aria-hidden className="text-xl">✦</span>
                  </div>
                  <FeatureBadge type={card.badgeType} target={card.target} inView={!shouldReduceMotion} />
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-xl font-bold">{card.title}</h4>
                  <p className="text-sm text-sky-100/80">{card.copy}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/40 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sky-200">Process timeline</p>
              <h3 className="text-2xl font-bold sm:text-3xl">From intake to reporting without friction</h3>
            </div>
            <div className="text-sm text-sky-100/70">Keyboard: ← → to change steps</div>
          </div>
          <div
            className="mt-6"
            role="group"
            aria-label="Campaign process steps"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                const currentIndex = processSteps.findIndex((s) => s.id === activeStep);
                setActiveStep(processSteps[(currentIndex + 1) % processSteps.length].id);
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                const currentIndex = processSteps.findIndex((s) => s.id === activeStep);
                setActiveStep(processSteps[(currentIndex - 1 + processSteps.length) % processSteps.length].id);
              }
            }}
          >
            <div className="relative mb-6 flex items-center justify-between gap-4 overflow-hidden rounded-full bg-white/5 px-4 py-6 shadow-inner shadow-sky-900/30 sm:px-8">
              <svg
                className="absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 text-sky-300/40"
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.line
                  x1="0"
                  x2="100"
                  y1="1"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 1, transition: { duration: 0.6 } }}
                />
              </svg>
              {processSteps.map((step) => (
                <motion.button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl px-2 py-1 text-center text-sm font-semibold ${activeStep === step.id ? 'text-white' : 'text-sky-100/70'}`}
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.9 }}
                  animate={shouldReduceMotion ? { opacity: 1, scale: activeStep === step.id ? 1.04 : 1 } : { opacity: 1, scale: activeStep === step.id ? 1.06 : 1, transition: { type: 'spring', stiffness: 240, damping: 18 } }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  aria-pressed={activeStep === step.id}
                  aria-label={`${step.title}: ${step.subtitle}`}
                >
                  <motion.span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border ${activeStep === step.id ? 'border-sky-200 bg-sky-500/20 text-white' : 'border-white/10 bg-white/5 text-sky-200'}`}
                    layout
                    transition={shouldReduceMotion ? undefined : { type: 'spring', stiffness: 220, damping: 16 }}
                  >
                    {step.title.charAt(0)}
                  </motion.span>
                  <span className="max-w-[140px] text-xs sm:max-w-[200px]">{step.title}</span>
                </motion.button>
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 to-slate-900/80 p-6 shadow-xl shadow-sky-950/40">
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent" aria-hidden />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sky-100/80">
                      <span>Dashboard View</span>
                      <span className="rounded-full bg-sky-400/20 px-2 py-1 text-[11px] font-bold text-sky-50">Live</span>
                    </div>
                    <div className="aspect-[5/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
                      <div className="grid h-full grid-rows-[auto,1fr] gap-3 text-left text-sky-50/90">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span>{activeProcess.title}</span>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">Mock</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-sky-100/70">Status</p>
                            <p className="mt-2 text-lg font-bold text-white">On track</p>
                          </div>
                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-sky-100/70">Owner</p>
                            <p className="mt-2 text-lg font-bold text-white">Ops Desk</p>
                          </div>
                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-sky-100/70">Notes</p>
                            <p className="mt-2 text-sm text-sky-50/90">{activeProcess.subtitle}</p>
                          </div>
                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-sky-100/70">Next</p>
                            <p className="mt-2 text-sm text-sky-50/90">Updated when step changes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold">{activeProcess.title}</h4>
                <p className="text-sky-100/80">{activeProcess.subtitle}</p>
                <ul className="space-y-3 text-sky-50/90">
                  <AnimatePresence mode="popLayout">
                    {activeProcess.bullets.map((item) => (
                      <motion.li
                        key={`${activeProcess.id}-${item}`}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" aria-hidden />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </div>
          <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic />
        </div>

        {/* Trading Cards */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-200">Why Us — Collectible Cards</p>
            <h3 className="text-2xl font-bold sm:text-3xl">Six reasons brands stay with Sire Media</h3>
            <p className="text-sky-100/80">Tap or press Enter to flip. Hover to tilt.</p>
          </div>
          <LayoutGroup>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(whyUsCards as WhyUsCard[]).map((card, index) => (
                <WhyUsCardItem key={card.id} card={card} index={index} shouldReduceMotion={shouldReduceMotion} />
              ))}
            </div>
          </LayoutGroup>
        </div>

        {/* Pricing Philosophy */}
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sky-200">Pricing Philosophy</p>
              <h3 className="text-2xl font-bold sm:text-3xl">Transparent options, no surprises</h3>
              <p className="text-sky-100/80">Not real prices. Just how we structure work.</p>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-50 shadow-inner shadow-sky-900/30">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-sky-200/60 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-300"
                checked={showRanges}
                onChange={(event) => setShowRanges(event.target.checked)}
              />
              Show ballpark ranges?
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pricing.map((plan, index) => (
              <motion.article
                key={plan.id}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-sky-950/40 backdrop-blur"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: shouldReduceMotion ? 'tween' : 'spring', duration: 0.6, delay: shouldReduceMotion ? 0 : index * 0.05, damping: 14, stiffness: 140 }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                aria-label={`${plan.title} pricing card`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold">{plan.title}</h4>
                  <span className="rounded-full bg-sky-400/20 px-3 py-1 text-xs font-semibold text-sky-50">{plan.bestFor.split(' ')[0]}</span>
                </div>
                <p className="mt-2 text-sm text-sky-100/80">Best for: {plan.bestFor}</p>
                <ul className="mt-4 space-y-3 text-sky-50/90">
                  {plan.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {showRanges && (
                  <motion.div
                    className="mt-4 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  >
                    {plan.range}
                  </motion.div>
                )}
                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-900/40 transition hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
                  {plan.cta}
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
