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
    const [activeId, setActiveId] = useState<string>((cardsData as TradingCardData[])[0]?.id ?? '');

    useEffect(() => {
        const handleMode = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const isMobile = window.innerWidth < 640;
            const shouldStack = !isMobile && rect.top > 220;
            setStacked(shouldStack);
        };

        handleMode();
        window.addEventListener('scroll', handleMode, { passive: true });
        window.addEventListener('resize', handleMode);
        return () => {
            window.removeEventListener('scroll', handleMode);
            window.removeEventListener('resize', handleMode);
        };
    }, []);

    const cards = cardsData as TradingCardData[];
    const centerIndex = Math.floor(cards.length / 2);

    return (
        <section
            ref={sectionRef}
            className="relative z-0 mt-12 w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-2 pb-24 pt-16 shadow-2xl shadow-sky-900/20 sm:px-8 sm:pt-32 sm:pb-40"
            aria-labelledby="command-center-heading"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-[10%] -top-[16%] h-64 w-64 rounded-full bg-blue-600/20 blur-[120px]" />
                <div className="absolute -bottom-[18%] -right-[8%] h-64 w-64 rounded-full bg-purple-500/20 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-4 text-center text-slate-50">
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Campaign Command Center
                </span>
                <h2 id="command-center-heading" className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                    Same power. Fresh canvas.
                </h2>
                <p className="max-w-3xl text-base font-medium text-blue-50/90 sm:text-lg">
                    Explore the exact features from our previous workspace—approvals, deliverables, timelines, and payouts—now remixed into a new interactive canvas built directly into the page.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-blue-50/80">
                    <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Tap to reveal details</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Scroll to stack or spread</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Mobile-friendly layout</span>
                </div>
            </div>

            <div
                className={`relative z-10 mx-auto mt-12 w-full max-w-[1400px] transition-all duration-500 ${stacked ? 'h-[560px] flex items-center justify-center' : ''
                    }`}
            >
                <div
                    className={`command-scroll flex w-full gap-5 transition-all duration-500 ${stacked ? 'relative h-full items-center justify-center' : 'overflow-x-auto pb-10'
                        } ${stacked ? '' : 'snap-x snap-mandatory'}`}
                >
                    {cards.map((card, index) => {
                        const isActive = card.id === activeId;
                        const isFlipped = card.id === flippedId;
                        const offset = index - centerIndex;
                        const absOffset = Math.abs(offset);
                        const focusScale = isActive ? 1.04 : 1;

                        const deckTransform = stacked
                            ? `
                                translate3d(${-offset * (10 + absOffset * 3)}px, 0, ${-absOffset * 30}px)
                                rotateZ(${-offset * 3}deg)
                                scale(${focusScale})
                            `
                            : `
                                translate3d(0, 0, 0)
                                scale(${isActive ? 1.02 : 1})
                            `;

                        return (
                            <div
                                key={card.id}
                                className={`${stacked ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'snap-center flex-shrink-0'
                                    } w-[85vw] sm:w-[320px] md:w-[360px]`}
                                style={{
                                    transform: deckTransform,
                                    zIndex: stacked ? cards.length - Math.abs(offset) : 1,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveId(card.id);
                                        setFlippedId(isFlipped ? null : card.id);
                                    }}
                                    className={`command-card group relative block h-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70 p-4 text-left shadow-2xl shadow-black/20 backdrop-blur ${isActive ? 'ring-2 ring-blue-400/70' : 'ring-1 ring-white/5'
                                        } transition`}
                                    aria-pressed={isFlipped}
                                >
                                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-blue-100/70">
                                        <span>{card.flavor}</span>
                                        <span>{isFlipped ? 'Story' : 'Snapshot'}</span>
                                    </div>
                                    <div className="mt-4 overflow-hidden rounded-xl bg-slate-800/70 shadow-inner">
                                        <div
                                            className="aspect-[4/3] w-full bg-cover bg-center"
                                            style={{
                                                backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.3), rgba(15,23,42,0.6)), url(${card.image})`,
                                            }}
                                        />
                                    </div>
                                    <div className="mt-5 flex flex-col gap-2">
                                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                                        <p className="text-sm text-blue-100/90">{card.definition}</p>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-blue-50/80">
                                        {card.merits.map((item) => (
                                            <span key={item} className="rounded-lg bg-white/10 px-3 py-2 font-semibold">
                                                {item}
                                            </span>
                                        ))}
                                    </div>

                                    <div
                                        className={`mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-blue-50/90 transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <p className="text-xs uppercase tracking-[0.18em] text-blue-100/80">Why it matters</p>
                                        <ul className="mt-3 space-y-2">
                                            {card.whyUs.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <span className="mt-1 text-blue-300">◆</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-sm text-blue-100/80">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            {stacked ? 'Stacked view' : 'Spread view'}
                                        </span>
                                        <span className="opacity-80">Tap to reveal</span>
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
