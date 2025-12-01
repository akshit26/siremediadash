'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const heroStats = [
  { key: 'influencers', label: 'Influencers', value: 432452 },
  { key: 'brands', label: 'Brands', value: 94002 },
  { key: 'categories', label: 'Categories', value: 1845 },
];

const creatorCards = [
  { id: 1, name: 'Manoj Vandre', role: 'Fashion Creator', audience: '787K', location: 'India', adPrice: '₹ 95K', videoPrice: '₹ 50K', color: 'pink' },
  { id: 2, name: 'Moana Patel', role: 'Fashion Creator', audience: '787K', location: 'India', adPrice: '₹ 95K', videoPrice: '₹ 50K', color: 'orange' },
  { id: 3, name: 'Asmeen Lote', role: 'Fashion Creator', audience: '787K', location: 'India', adPrice: '₹ 95K', videoPrice: '₹ 50K', color: 'blue' },
];

const categories = ['Fashion', 'Tech', 'Lifestyle', 'Gaming'];

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
  const targetCounts = useMemo(
    () => ({
      influencers: 432452,
      brands: 94002,
      categories: 1845,
      showcase: 232452,
    }),
    []
  );
  const counts = useAnimatedCounts(targetCounts);

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
  };

  return (
    <div className="page-shell">
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
                Find
                <br />
                <span className="highlight">Influencers</span>
                <br />
                to collaborate with
              </h1>
              <form className="search-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="search">
                  Search influencers
                </label>
                <input id="search" type="search" placeholder="Search influencer..." />
                <div className="filter" aria-hidden>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18v2l-7 6v4l-4 2v-6L3 8z" />
                  </svg>
                </div>
                <button type="submit">Search</button>
              </form>
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
                <span className="pill">See how it&apos;s done</span>
              </div>
              <div className="card-body">
                <div className="avatars">
                  <div className="avatar a1" />
                  <div className="avatar a2" />
                  <div className="avatar a3" />
                  <div className="avatar a4" />
                  <div className="avatar a5" />
                </div>
                <div className="cta">Start scouting</div>
              </div>
            </div>
          </div>
        </section>

        <section className="filters" id="campaigns">
          {categories.map((category, index) => (
            <button key={category} className={`pill ${index === 0 ? 'active' : ''}`}>
              {category}
            </button>
          ))}
        </section>

        <section className="cards-grid" id="analytics">
          {creatorCards.slice(0, 2).map((card) => (
            <article className="profile-card" key={card.id}>
              <div className="profile">
                <div className={`img-wrap ${card.color}`} />
                <div className="meta">
                  <h3>{card.name}</h3>
                  <p>{card.role}</p>
                  <div className="numbers">
                    <span>{card.audience}</span>
                    <span>{card.location}</span>
                  </div>
                </div>
              </div>
              <div className="cta-row">
                <button className="ghost">Download Kit</button>
                <button className="primary">Send Message</button>
              </div>
              <div className="row">
                <span>Advertising Price</span>
                <strong>{card.adPrice}</strong>
              </div>
              <div className="row">
                <span>Per Video</span>
                <strong>{card.videoPrice}</strong>
              </div>
            </article>
          ))}

          <article className="profile-card large">
            <div className="badge">Show All</div>
            <div className="big-count">
              <div className="number">{counts.showcase?.toLocaleString()}</div>
              <div className="sub">Influencers</div>
            </div>
            <div className="floating-icons">
              <span className="spark" />
              <span className="spark" />
              <div className="emoji">👑</div>
              <div className="emoji">⭐</div>
            </div>
            <button className="primary stretch">Explore more</button>
          </article>

          {creatorCards.slice(2).map((card) => (
            <article className="profile-card" key={card.id}>
              <div className="profile">
                <div className={`img-wrap ${card.color}`} />
                <div className="meta">
                  <h3>{card.name}</h3>
                  <p>{card.role}</p>
                  <div className="numbers">
                    <span>{card.audience}</span>
                    <span>{card.location}</span>
                  </div>
                </div>
              </div>
              <div className="cta-row">
                <button className="ghost">Download Kit</button>
                <button className="primary">Send Message</button>
              </div>
              <div className="row">
                <span>Advertising Price</span>
                <strong>{card.adPrice}</strong>
              </div>
              <div className="row">
                <span>Per Video</span>
                <strong>{card.videoPrice}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
