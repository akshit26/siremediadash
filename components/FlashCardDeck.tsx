'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import cardsData from '../data/section2Cards.json';
import FlashCard, { type CardState, type FlashCardData } from './FlashCard';

export default function FlashCardDeck() {
  const cards = useMemo<FlashCardData[]>(() => cardsData, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFocus = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          const newIndex = Number(visible[0].target.getAttribute('data-index'));
          if (!Number.isNaN(newIndex)) {
            setActiveIndex(newIndex);
          }
        }
      },
      { root: container, threshold: [0.35, 0.5, 0.65], rootMargin: '-40% 0px -40% 0px' }
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [cards]);

  const scrollToIndex = (nextIndex: number) => {
    const target = itemRefs.current[nextIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    const card = cards[activeIndex];
    if (!card) return;
    setLiveMessage(
      `Now showing: ${card.title} — ${card.merits.length} merits, ${card.demerits.length} demerits, ${card.whyUs.length} why-us points.`
    );
  }, [activeIndex, cards]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();

      if (event.key === 'ArrowDown') {
        const next = Math.min(activeIndex + 1, cards.length - 1);
        setActiveIndex(next);
        scrollToIndex(next);
      }

      if (event.key === 'ArrowUp') {
        const prev = Math.max(activeIndex - 1, 0);
        setActiveIndex(prev);
        scrollToIndex(prev);
      }
    };

    const current = containerRef.current;
    current?.addEventListener('keydown', handler);
    return () => current?.removeEventListener('keydown', handler);
  }, [activeIndex, cards.length]);

  const getState = (index: number): CardState => {
    if (index === activeIndex) return 'active';
    if (Math.abs(index - activeIndex) === 1) return 'near';
    return 'inactive';
  };

  return (
    <div className="card-rail-wrapper">
      <div
        ref={containerRef}
        className="flashcard-scroll card-rail mx-auto mt-12 flex max-h-[78vh] w-full max-w-4xl flex-col gap-8 overflow-y-auto px-2 pb-6 pt-2 snap-y snap-mandatory"
        tabIndex={0}
        role="region"
        aria-label="Campaign Management flash cards"
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            data-index={index}
            className="snap-center"
          >
            <FlashCard card={card} state={getState(index)} index={index} onFocus={handleFocus} />
          </div>
        ))}
      </div>
      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
}
