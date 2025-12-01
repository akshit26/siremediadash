'use client';

import Image from 'next/image';
import { type FormEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import cardsData from '../data/section2Cards.json';

type HeroStat = {
  key: string;
  label: string;
  value: number;
};

type TradingCardData = {
  id: string;
  title: string;
  image: string;
  definition: string;
  flavor: string;
  merits: string[];
  whyUs: string[];
};

const heroStats: HeroStat[] = [
  { key: 'creators', label: 'Creators Verified', value: 1240 },
  { key: 'campaigns', label: 'Campaigns Managed', value: 89 },
  { key: 'categories', label: 'Brand Categories', value: 32 },
];

const searchPlaceholders = [
  'Search affiliated creators…',
  'Search your campaign creators…',
  'Search Sire Media verified creators…',
  'Search inside your campaign…',
  'Search creators assigned to your project…',
];

const flowSteps = [
  {
    id: 'deliverables',
    title: 'Deliverables',
    detail: 'Shot lists, posting cadence, and approvals in one lane.',
    icon: '📦',
  },
  {
    id: 'approvals',
    title: 'Approvals',
    detail: 'Timed checkpoints with creator nudges and notes.',
    icon: '✅',
  },
  {
    id: 'timeline',
    title: 'Timelines',
    detail: 'Gantt-like view for reels, stories, and giveaways.',
    icon: '⏱️',
  },
];

function useAnimatedCounts(targets: Record<string, number>, duration = 1800) {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.keys(targets).map((key) => [key, 0]))
  );

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextCounts = Object.fromEntries(
        Object.entries(targets).map(([key, value]) => [key, Math.floor(value * eased)])
      );
      setCounts(nextCounts);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targets, duration]);

  return counts;
}

function CommandCenterShowcase() {
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
      className="relative z-0 mt-12 w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-24 pt-16 shadow-2xl shadow-sky-900/20 sm:px-8 sm:pt-32 sm:pb-40"
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
          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Tap to flip details</span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Scroll to stack or spread</span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Mobile-friendly layout</span>
        </div>
      </div>

      <div
        className={`relative z-10 mx-auto mt-12 w-full max-w-[1400px] transition-all duration-500 ${
          stacked ? 'h-[560px] flex items-center justify-center' : ''
        }`}
      >
        <div
          className={`flex w-full gap-5 transition-all duration-500 ${
            stacked ? 'relative h-full items-center justify-center' : 'overflow-x-auto pb-8'
          }`}
        >
          {cards.map((card, index) => {
            const offset = index - centerIndex;
            const deckTransform = stacked
              ? `translateX(${offset * 26}px) translateY(${Math.abs(offset) * 14}px) rotate(${offset * 5}deg) scale(${
                  index === centerIndex ? 1 : 0.96
                })`
              : 'none';

            const isActive = activeId === card.id;
            const isFlipped = flippedId === card.id;

            return (
              <div
                key={card.id}
                className={`${
                  stacked ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'snap-center flex-shrink-0'
                } w-full sm:w-[320px] md:w-[360px]`}
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
                  className={`group relative block h-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70 p-4 text-left shadow-2xl shadow-black/20 backdrop-blur ${
                    isActive ? 'ring-2 ring-blue-400/70' : 'ring-1 ring-white/5'
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
                    className={`mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-blue-50/90 transition-all duration-500 ${
                      isFlipped ? 'opacity-100' : 'opacity-0'
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
                    <span className="opacity-80">Tap to flip</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center text-sm text-blue-100/80">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">{stacked ? 'Scroll down to spread' : 'Scroll up to stack'}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Hold & drag on desktop</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Swipe on mobile</span>
          </div>
          <p className="text-xs text-blue-100/70">Live accessibility hint: cards keep the same content as our previous section, fully restyled.</p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(flowSteps[0].id);
  const [searchMessage, setSearchMessage] = useState('Private network search ready.');
  const targetCounts = useMemo(
    () => Object.fromEntries(heroStats.map(({ key, value }) => [key, value])),
    []
  );
  const counts = useAnimatedCounts(targetCounts);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      setProgress(Math.min(100, (video.currentTime / video.duration) * 100));
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    const handleLoadedMetadata = () => setProgress(0);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 12;
    const rotateY = (x - 0.5) * 12;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchMessage('Searching your exclusive roster...');
    setTimeout(() => setSearchMessage('Private network search ready.'), 1300);
  };

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (video.ended) {
        video.currentTime = 0;
      }
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="announcement-bar" role="banner">
        <span className="announcement-pill">Limited offer</span>
        <span className="announcement-copy">Enroll for a free trial now and unlock your next creator sprint.</span>
        <button className="announcement-cta" type="button">
          Start free trial
          <span aria-hidden>↗</span>
        </button>
      </div>
      <header className="top-bar">
        <div className="logo">
          <div className="logo-mark">
            <Image src="/sire-logo.svg" alt="Sire Media crown logo" width={36} height={32} priority />
          </div>
          <div className="logo-stack">
            <span>Sire Media</span>
            <span className="logo-tag">Exclusive Creator Network + Intelligent Campaign Management</span>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#home" className="active">
            Home
          </a>
          <a href="#messages">Messages</a>
          <a href="#campaigns">Campaigns</a>
          <a href="#analytics">Analytics</a>
          <span className="client-pill">Client Workspace</span>
        </nav>
        <div className="actions">
          <div className="location">
            <span className="dot" />
            <span>Gujarat, India</span>
          </div>
          <button className="login">Log in / Sign up</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="floating-bubbles">
            <span className="bubble b1" />
            <span className="bubble b2" />
            <span className="bubble b3" />
            <span className="bubble b4" />
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                <span className="block">Your Personal</span>
                <span className="block highlight">Influencer</span>
                <span className="block">Campaign Workspace</span>
              </h1>
              <p className="lead">
                Work with Sire Media’s verified creators and manage your entire campaign—from ideation to approvals to deliverables—in one intelligent dashboard.
              </p>
              <div className="search-context">Private creator network • Only available after onboarding</div>
              <form className="search-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="search">
                  Search verified creators inside your workspace
                </label>
                <input id="search" type="search" placeholder={searchPlaceholders[placeholderIndex]} />
                <div className="filter" aria-hidden>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18v2l-7 6v4l-4 2v-6L3 8z" />
                  </svg>
                </div>
                <button type="submit">Search private roster</button>
              </form>
              <div className="search-message">{searchMessage}</div>
              <div className="hero-actions">
                <button className="primary-cta" onClick={() => setActiveStep('deliverables')}>
                  <span>Get Started</span>
                  <span aria-hidden>↗</span>
                </button>
                <button className="ghost-cta" onClick={toggleVideo}>
                  {isPlaying ? 'Pause walkthrough' : 'Preview dashboard'}
                </button>
              </div>
              <div className="hero-stats">
                {heroStats.map((stat) => (
                  <div className="stat" key={stat.key}>
                    <span className="label">{stat.label}</span>
                    <strong>{counts[stat.key]?.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="hero-card"
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-header">
                <div className="sparkle">
                  <span />
                  <span />
                  <span />
                </div>
                <button
                  type="button"
                  className="pill card-cta"
                  onClick={() => {
                    setActiveStep('deliverables');
                    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <span>See Your Campaign Flow</span>
                  <span aria-hidden>↗</span>
                </button>
              </div>
              <div className="card-body">
                <div
                  className="video-box"
                  onClick={toggleVideo}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleVideo();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="video-frame">
                    <video
                      ref={videoRef}
                      preload="metadata"
                      playsInline
                      muted
                      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                      aria-label="Sample campaign walkthrough video"
                    />
                    <div className={`play-toggle ${isPlaying ? 'pause' : ''}`}>
                      {isPlaying ? <span>❚❚</span> : <span>▶</span>}
                    </div>
                  </div>
                  <div className="video-copy">
                    <p className="eyebrow">Walkthrough</p>
                    <h3>See Your Campaign Flow</h3>
                    <p className="subline">A quick walkthrough of deliverables, approvals, and creator timelines.</p>
                  </div>
                  <div className="progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="timeline">
                  {flowSteps.map((step) => (
                    <button
                      key={step.id}
                      className={`chip ${activeStep === step.id ? 'active' : ''}`}
                      onClick={() => setActiveStep(step.id)}
                    >
                      <span className="chip-icon" aria-hidden>
                        {step.icon}
                      </span>
                      {step.title}
                    </button>
                  ))}
                </div>
                <div className="timeline-detail">{flowSteps.find((s) => s.id === activeStep)?.detail}</div>
              </div>
            </div>
          </div>
        </section>

        <CommandCenterShowcase />
      </main>
    </div>
  );
}
