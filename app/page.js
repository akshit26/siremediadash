'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import Section2 from '../components/Section2';

const heroStats = [
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
  const videoRef = useRef(null);
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
    const id = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3200);
    return () => clearInterval(id);
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

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (video.ended) {
        video.currentTime = 0;
      }
      video.play();
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
      <div className="tagline">Powered by Sire Media — Exclusive Creator Network + Intelligent Campaign Management.</div>
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
                Work with Sire Media’s verified creators and manage your entire campaign—from ideation to approvals
                to deliverables—in one intelligent dashboard.
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

        <Section2 />

      </main>
    </div>
  );
}
