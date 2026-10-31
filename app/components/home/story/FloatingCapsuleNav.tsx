"use client";

import React, { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  name: string;
  emoji: string;
}

const navItems: NavItem[] = [
  { id: 'flappyfeed', name: 'FlappyFeed', emoji: '🕊️' },
  { id: 'starjar', name: 'StarJar 星愿瓶', emoji: '⭐' },
  { id: 'workout', name: '造己健身', emoji: '⚡' },
  { id: 'sharereader', name: 'ShareReader', emoji: '📖' },
];

export default function FloatingCapsuleNav() {
  const [activeSection, setActiveSection] = useState('flappyfeed');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    });

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none ${
        isScrolled ? 'opacity-100 translate-y-0' : 'opacity-90 -translate-y-1'
      }`}
    >
      <nav
        aria-label="产品快速导览"
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-[#0E111E]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-xs font-medium transition-all duration-200 flex items-center gap-1.5 select-none ${
                isActive
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="text-xs sm:text-sm">{item.emoji}</span>
              <span className="hidden md:inline">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
