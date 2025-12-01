'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { m, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion, Variants, LazyMotion, domAnimation } from 'framer-motion';
import TradingCard, { type TradingCardData } from './TradingCard';
import cardsData from '../data/section2Cards.json';

export default function TradingDeck() {
    const [isDeck, setIsDeck] = useState(false);
    const [flippedId, setFlippedId] = useState<string | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    // Scroll trigger logic
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (shouldReduceMotion) return; // Disable deck mode on reduced motion

        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Trigger when element crosses a threshold
            // We want it to be a Deck when it's lower on the screen (entering view)
            // And spread out (Line) when it's higher up (scrolled into view)
            // Disable deck mode on mobile (< 640px) for better UX
            const isMobile = window.innerWidth < 640;
            const shouldBeDeck = !isMobile && rect.top > 200;

            if (shouldBeDeck !== isDeck) {
                setIsDeck(shouldBeDeck);
            }
        }
    });

    const handleFlip = (id: string) => {
        setFlippedId(flippedId === id ? null : id);
    };

    // Deck calculations
    const centerIndex = Math.floor(cardsData.length / 2);

    const getDeckVariants = (index: number): Variants => {
        const offset = index - centerIndex;
        return {
            line: {
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                zIndex: 1,
                transition: {
                    duration: 0.5,
                    ease: "backOut",
                    delay: index * 0.05
                }
            },
            deck: {
                x: offset * 6, // Horizontal offset
                y: Math.abs(offset) * 4, // Vertical offset (arch effect)
                rotate: offset * 4, // Rotation fan
                scale: index === centerIndex ? 1.02 : 0.98,
                zIndex: cardsData.length - Math.abs(offset), // Center on top
                transition: {
                    duration: 0.42,
                    ease: [0.2, 0.9, 0.3, 1],
                    delay: Math.abs(offset) * 0.06 // Stagger from center
                }
            }
        };
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="relative w-full min-h-[600px] py-20 overflow-hidden">
                {/* Scroll Trigger */}
                <div ref={triggerRef} className="absolute top-0 w-full h-1 pointer-events-none opacity-0" />

                {/* Live Region for A11y */}
                <div className="sr-only" aria-live="polite">
                    {isDeck ? "Cards stacked into a deck." : "Cards arranged in a horizontal row."}
                </div>

                <div
                    ref={containerRef}
                    className={`
              relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 transition-all duration-500
              ${isDeck ? 'h-[500px] flex items-center justify-center' : 'h-auto'}
            `}
                >
                    {/* Container: Flex (Line) or Relative (Deck) */}
                    <m.div
                        className={`
                w-full
                ${isDeck ? 'relative flex items-center justify-center' : 'flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar'}
              `}
                        layout
                    >
                        <AnimatePresence>
                            {cardsData.map((card, index) => (
                                <m.div
                                    key={card.id}
                                    className={`
                      flex-shrink-0 snap-center
                      ${isDeck ? 'absolute left-0 right-0 mx-auto w-fit' : 'relative'}
                    `}
                                    variants={getDeckVariants(index)}
                                    initial="line"
                                    animate={isDeck ? 'deck' : 'line'}
                                    style={{
                                        zIndex: isDeck ? cardsData.length - Math.abs(index - centerIndex) : 1
                                    }}
                                >
                                    <TradingCard
                                        card={card}
                                        index={index}
                                        isDeck={isDeck}
                                        isFlipped={flippedId === card.id}
                                        onFlip={() => handleFlip(card.id)}
                                    />

                                    {/* Flash Overlay on Deck Entry (Center card only) */}
                                    {isDeck && index === centerIndex && (
                                        <m.div
                                            className="absolute inset-0 bg-white rounded-[20px] pointer-events-none mix-blend-screen z-50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 0.28, 0] }}
                                            transition={{ duration: 0.28, delay: 0.2 }}
                                        />
                                    )}
                                </m.div>
                            ))}
                        </AnimatePresence>
                    </m.div>
                </div>

                {/* Mobile Fallback / Instruction */}
                <div className="text-center mt-8 text-slate-500 text-sm sm:hidden">
                    Swipe to explore • Tap to flip
                </div>
                <div className="text-center mt-8 text-slate-500 text-sm hidden sm:block">
                    {isDeck ? "Scroll down to spread" : "Scroll up to stack"} • Click to flip
                </div>
            </div>
        </LazyMotion>
    );
}
