'use client';

import { useState, useRef, useMemo } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export type TradingCardData = {
    id: string;
    title: string;
    image: string;
    definition: string;
    flavor: string;
    merits: string[];
    whyUs: string[];
};

interface TradingCardProps {
    card: TradingCardData;
    index: number;
    isDeck: boolean;
    isFlipped: boolean;
    onFlip: () => void;
    style?: React.CSSProperties;
}

export default function TradingCard({ card, index, isDeck, isFlipped, onFlip, style }: TradingCardProps) {
    const shouldReduceMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    // Animation variants
    const frontVariants = {
        initial: { rotateY: 0 },
        flipped: { rotateY: 180 },
    };

    const backVariants = {
        initial: { rotateY: -180 },
        flipped: { rotateY: 0 },
    };

    // Hover effect (desktop only)
    const hoverScale = !shouldReduceMotion && !isDeck && isHovered ? 1.03 : 1;
    const hoverShadow = !shouldReduceMotion && !isDeck && isHovered
        ? '0 12px 40px rgba(3,10,25,0.45), 0 6px 16px rgba(30,144,255,0.1)'
        : '0 8px 30px rgba(3,10,25,0.35), 0 3px 10px rgba(30,144,255,0.06)';

    return (
        <m.article
            className="relative w-[90%] h-[460px] sm:w-[340px] sm:h-[480px] rounded-[20px] cursor-pointer touch-none select-none"
            style={{
                ...style,
                perspective: 1200,
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onFlip}
            animate={{
                scale: hoverScale,
                boxShadow: hoverShadow,
            }}
            transition={{ duration: 0.5 }}
            role="group"
            aria-label={`${card.title} card`}
        >
            <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
                {/* Front Face */}
                <m.div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900/90 via-blue-900/90 to-slate-900/90 backdrop-blur-xl rounded-[20px] overflow-hidden border border-white/10"
                    style={{ backfaceVisibility: 'hidden' }}
                    variants={frontVariants}
                    initial="initial"
                    animate={isFlipped ? 'flipped' : 'initial'}
                    transition={{ duration: 0.52 }}
                >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-100 bg-sky-900/60 backdrop-blur-md rounded-full border border-sky-500/30">
                            {card.flavor}
                        </span>
                    </div>

                    {/* Image Area (42% height) */}
                    <div className="h-[42%] w-full relative bg-slate-950">
                        <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover opacity-90"
                            sizes="(max-width: 640px) 84vw, 260px"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                    </div>

                    {/* Content Area */}
                    <div className="h-[58%] p-5 flex flex-col relative">
                        {/* Title */}
                        <h3 className="text-[22px] font-bold text-white text-center leading-tight mb-2">
                            {card.title}
                        </h3>

                        {/* Spacer */}
                        <div className="flex-grow flex items-center justify-center opacity-10">
                            {/* Decorative element or just space */}
                            <div className="w-8 h-8 rounded-full border-2 border-white" />
                        </div>

                        {/* Footer Definition (18% height approx) */}
                        <div className="mt-auto pt-4 border-t border-white/10">
                            <p className="text-[13px] leading-snug text-slate-300 text-center">
                                {card.definition}
                            </p>
                        </div>

                        {/* Gloss Overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                        {/* Interactive Shimmer */}
                        <div
                            className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500"
                            style={{ opacity: isHovered ? 1 : 0 }}
                        />
                    </div>
                </m.div>

                {/* Back Face */}
                <m.div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-950/95 via-slate-900/95 to-blue-950/95 backdrop-blur-xl rounded-[20px] overflow-hidden border border-white/10 p-6 flex flex-col gap-4"
                    style={{ backfaceVisibility: 'hidden' }}
                    variants={backVariants}
                    initial="initial"
                    animate={isFlipped ? 'flipped' : 'initial'}
                    transition={{ duration: 0.52 }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-900 to-slate-900" />

                    <div className="relative z-10 space-y-4 overflow-y-auto hide-scrollbar">
                        <div>
                            <h4 className="text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">Merits</h4>
                            <ul className="space-y-1">
                                {card.merits.map((m, i) => (
                                    <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">▸</span> {m}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Why Us</h4>
                            <ul className="space-y-1">
                                {card.whyUs.map((m, i) => (
                                    <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">✓</span> {m}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="group relative w-full mt-4 py-2.5 overflow-hidden rounded-xl bg-sky-950/30 border border-sky-500/30 transition-all hover:border-sky-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative text-sky-200 text-xs font-bold uppercase tracking-wider group-hover:text-sky-100">
                                Explore Feature <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </span>
                        </button>
                    </div>

                    <div className="mt-auto relative z-10 pt-3 border-t border-white/10 text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sire Media</span>
                    </div>
                </m.div>
            </div>
        </m.article>
    );
}
