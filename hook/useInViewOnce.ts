import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // 👈 animate only once
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
