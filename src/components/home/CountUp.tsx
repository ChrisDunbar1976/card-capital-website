'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 to `to` over ~900ms the first time it scrolls into view.
 * Plain rAF + IntersectionObserver — no library weight.
 */
export function CountUp({
  to,
  className,
  style,
}: {
  to: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 900, 1);
          // ease-out-quart
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(Math.round(eased * to));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  );
}
