'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const heroStats = [
  { key: 'influencers', label: 'Influencers', value: 432452 },
  { key: 'brands', label: 'Brands', value: 94002 },
  { key: 'categories', label: 'Categories', value: 1845 },
];

const searchPlaceholders = [
  'Search affiliated creators…',
  'Search your campaign creators…',
  'Search Sire Media verified creators…',
  'Search inside your campaign…',
  'Search creators assigned to your project…',
];

const flowSteps = [
  { id: 'deliverables', title: 'Deliverables', detail: 'Shot lists, posting cadence, and approvals in one lane.' },
  { id: 'approvals', title: 'Approvals', detail: 'Timed checkpoints with creator nudges and notes.' },
  { id: 'timeline', title: 'Timeline', detail: 'Gantt-like view for reels, stories, and giveaways.' },
];

function useAnimatedCounts(targets, duration = 1800) {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(Object.entries(targets).map(([key]) => [key, 0]))
  );

  useEffect(() => {
    let raf;
    const start = performance.now();

    const tick = (now) => {
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

export default function HomePage() {
  const cardRef = useRef(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(22);
  const [activeStep, setActiveStep] = useState(flowSteps[0].id);
  const [searchMessage, setSearchMessage] = useState('Private network search ready.');
  const targetCounts = useMemo(
    () => Object.fromEntries(heroStats.map(({ key, value }) => [key, value])),
    []
  );
  const counts = useAnimatedCounts(targetCounts);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 6 : prev + 5));
    }, 450);
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleMouseMove = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchMessage('Searching your exclusive roster...');
    setTimeout(() => setSearchMessage('Private network search ready.'), 1300);
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);

  return (
    <div className="page-shell">
      <div className="tagline">Powered by Sire Media — Exclusive Creator Network + Intelligent Campaign Management.</div>
      <header className="top-bar">
        <div className="logo">
          <div className="logo-mark">
            <Image src="/sire-logo.svg" alt="Sire Media crown logo" width={36} height={32} priority />
          </div>
          <span>Sire Media</span>
        </div>
        <nav className="nav-links">
          <a href="#home" className="active">
            Home
          </a>
          <a href="#messages">Messages</a>
          <a href="#campaigns">Campaigns</a>
          <a href="#analytics">Analytics</a>
        </nav>
        <div className="actions">
          <div className="location">
            <span className="dot" />
            <span>Gujarat, India</span>
          </div>
          <button className="login">Login / Signup</button>
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
                Your Personal
                <br />
                <span className="highlight">Influencer Campaign</span>
                <br />
                Workspace.
              </h1>
              <p className="lead">
                Work with Sire Media’s verified creators and manage your entire campaign—from ideation to
                execution—through a streamlined and intelligent dashboard.
              </p>
              <form className="search-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="search">
                  Search influencers
                </label>
                <input id="search" type="search" placeholder={searchPlaceholders[placeholderIndex]} />
                <div className="filter" aria-hidden>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18v2l-7 6v4l-4 2v-6L3 8z" />
                  </svg>
                </div>
                <button type="submit">Get Started</button>
              </form>
              <div className="search-message">{searchMessage}</div>
              <div className="hero-actions">
                <button className="primary-cta" onClick={() => setActiveStep('deliverables')}>
                  Build campaign workspace
                </button>
                <button className="ghost-cta" onClick={togglePlay}>
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
                <span className="pill">See Your Campaign Flow</span>
              </div>
              <div className="card-body">
                <div className="video-box" onClick={togglePlay} role="button" tabIndex={0}>
                  <div className={`play-toggle ${isPlaying ? 'pause' : ''}`}>
                    {isPlaying ? <span>❚❚</span> : <span>▶</span>}
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
                      {step.title}
                    </button>
                  ))}
                </div>
                <div className="timeline-detail">{flowSteps.find((s) => s.id === activeStep)?.detail}</div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
