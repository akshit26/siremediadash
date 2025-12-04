'use client';

import { useEffect, useRef, useState } from 'react';
import cardsData from '../data/section2Cards.json';

type TradingCardData = {
    id: string;
    title: string;
    image: string;
    definition: string;
    flavor: string;
    merits: string[];
    whyUs: string[];
};

export default function CommandCenterShowcase() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [stacked, setStacked] = useState(false);
    const [flippedId, setFlippedId] = useState<string | null>(null);

    useEffect(() => {
        const handleMode = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const isMobile = window.innerWidth < 640;
            const shouldStack = !isMobile && rect.top > 100 && rect.top < 600; // Adjusted trigger
            setStacked(shouldStack);

            // Haptic/Visual cue when stacking
            if (shouldStack && !stacked) {
                if (navigator.vibrate) navigator.vibrate(10);
            }
        };

        handleMode();
        window.addEventListener('scroll', handleMode, { passive: true });
        window.addEventListener('resize', handleMode);
        return () => {
            window.removeEventListener('scroll', handleMode);
            window.removeEventListener('resize', handleMode);
        };
    }, [stacked]);

    const cards = cardsData as TradingCardData[];
    const centerIndex = Math.floor(cards.length / 2);

    return (
        <section
            ref={sectionRef}
            className="relative z-0 mt-0 w-full overflow-hidden px-2 pb-24 pt-16 sm:px-8 sm:pt-32 sm:pb-40"
            aria-labelledby="command-center-heading"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-[10%] -top-[16%] h-64 w-64 rounded-full bg-neon-blue/20 blur-[120px]" />
                <div className="absolute -bottom-[18%] -right-[8%] h-64 w-64 rounded-full bg-neon-purple/20 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-4 text-center text-slate-50">
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Campaign Command Center
                </span>
                <h2 id="command-center-heading" className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                    Same power. Fresh canvas.
                </h2>
                <p className="max-w-3xl text-base font-medium text-blue-50/90 sm:text-lg">
                    Explore the exact features from our previous workspace—approvals, deliverables, timelines, and payouts.
                </p>

                {/* Scroll Cue */}
                <div className="mt-8 flex flex-col items-center gap-2 animate-bounce opacity-80">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Scroll to explore</span>
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            <div
                className={`relative z-10 mx-auto mt-12 w-full max-w-[1400px] transition-all duration-500 ${stacked ? 'h-[560px] flex items-center justify-center' : ''
                    }`}
            >
                <div
                    className={`command-scroll flex w-full gap-2 transition-all duration-500 ${stacked ? 'relative h-full items-center justify-center' : 'overflow-x-auto pb-10'
                        } ${stacked ? '' : 'snap-x snap-mandatory'}`}
                >
                    {cards.map((card, index) => {
                        const isFlipped = card.id === flippedId;
                        const offset = index - centerIndex;
                        const absOffset = Math.abs(offset);

                        // Shuffle animation logic (closer spacing)
                        const deckTransform = stacked
                            ? `
                                translate3d(${-offset * 4}px, 0, ${-absOffset * 10}px)
                                rotateZ(${-offset * 5}deg)
                                scale(${1 - absOffset * 0.05})
                            `
                            : `translate3d(0, 0, 0)`;

                        return (
                            <div
                                key={card.id}
                                className={`${stacked ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'snap-center flex-shrink-0'
                                    } w-[85vw] sm:w-[300px] transition-all duration-500`}
                                style={{
                                    transform: deckTransform,
                                    zIndex: stacked ? cards.length - Math.abs(offset) : 1,
                                    opacity: stacked ? 1 - absOffset * 0.1 : 1
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setFlippedId(isFlipped ? null : card.id)}
                                    className="command-card group relative block h-full w-full overflow-hidden rounded-2xl bg-slate-900/80 p-4 text-left shadow-2xl backdrop-blur transition hover:scale-[1.02]"
                                    aria-pressed={isFlipped}
                                >
                                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-800">
                                        <div
                                            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{
                                                backgroundImage: `url(${card.image})`,
                                            }}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-white">{card.title}</h3>
                                        <p className="mt-1 text-sm text-blue-100/80 line-clamp-2">{card.definition}</p>
                                    </div>

                                    {/* Simplified content - removed extra badges */}

                                    <div className={`absolute inset-0 bg-slate-900/95 p-6 transition-opacity duration-300 flex flex-col justify-center ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                        <p className="text-xs uppercase tracking-[0.18em] text-blue-300">Key Benefit</p>
                                        <p className="mt-2 text-sm text-white">{card.flavor}</p>
                                        <div className="mt-4 space-y-2">
                                            {card.merits.slice(0, 2).map((item) => (
                                                <div key={item} className="flex items-center gap-2 text-xs text-blue-100">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
