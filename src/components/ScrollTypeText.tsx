'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Props {
  text: string;
}

export default function ScrollTypeText({ text }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const hRef = useRef<HTMLHeadingElement>(null);
  const textLen = text.length + 1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const hEl = hRef.current;
    if (!section || !hEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        hEl,
        { '--idx': 0 },
        {
          '--idx': textLen,
          duration: 1,
          ease: `steps(${textLen})`,
          scrollTrigger: {
            trigger: section,
            scrub: 0.2,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
              hEl.style.setProperty(
                '--velocity',
                String(Math.min(Math.abs(self.getVelocity()) / 1000, 1))
              );
            },
            onScrubComplete: () => hEl.style.setProperty('--velocity', '0'),
          },
        }
      );
    });

    return () => ctx.revert();
  }, [textLen]);

  return (
    <section
      ref={sectionRef}
      className="scroll-type-trigger relative"
      style={{ minHeight: '200vh', background: 'var(--theme-bg)' }}
    >
      <div className="sticky top-0 min-h-screen flex items-center justify-center px-6 py-20">
        <h2
          ref={hRef}
          className="scroll-type-h max-w-3xl text-2xl md:text-3xl lg:text-4xl leading-relaxed"
          style={{ '--text-length': textLen } as React.CSSProperties}
        >
          <span className="scroll-type-span">{text} </span>
        </h2>
      </div>
    </section>
  );
}
