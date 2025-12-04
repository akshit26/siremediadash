'use client';

import Image from 'next/image';
import { type FormEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import CommandCenterShowcase from '../components/CommandCenterShowcase';
import SectionThree from '../components/SectionThree';
import { heroStats, searchPlaceholders, flowSteps } from '../data/constants';
import { useAnimatedCounts } from '../hooks/useAnimatedCounts';

export default function HomePage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
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
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
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
    <LazyMotion features={domAnimation}>
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
          <button
            type="button"
            className={`mobile-nav-toggle ${navOpen ? 'active' : ''}`}
            aria-expanded={navOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
            <a href="#home" className="active" onClick={() => setNavOpen(false)}>
              Home
            </a>
            <a href="#messages" onClick={() => setNavOpen(false)}>
              Messages
            </a>
            <a href="#campaigns" onClick={() => setNavOpen(false)}>
              Campaigns
            </a>
            <a href="#analytics" onClick={() => setNavOpen(false)}>
              Analytics
            </a>
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
          <SectionThree />
        </main>
      </div>
    </LazyMotion>
  );
}
