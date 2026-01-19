"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteStore } from "@/store/useInfiniteStore";

export function useInfiniteProducts(key: string, apiUrl: string) {
  const {
    key: currentKey,
    products,
    page,
    lastLoadedPage,
    scrollY,
    hasMore,
    reset,
    setProducts,
    addProducts,
    setPage,
    setScrollY,
    setHasMore,
    setLastLoadedPage,
  } = useInfiniteStore();

  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadingRef = useRef(false);
  const restoredRef = useRef(false);
  const pageRef = useRef(page);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* keep page ref in sync */
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  /* reset on key change */
  useEffect(() => {
    if (currentKey !== key) {
      reset(key);
      setTotal(0);
    }
  }, [key, currentKey, reset]);

  const buildUrl = (p: number) => {
    const sep = apiUrl.includes("?") ? "&" : "?";
    return `${apiUrl}${sep}page=${p}`;
  };

  const loadPage = async (p: number) => {
    if (loadingRef.current) return;
    if (p !== 1 && !hasMore) return;

    loadingRef.current = true;
    p === 1 ? setIsLoading(true) : setIsLoadingMore(true);

    try {
      const res = await fetch(buildUrl(p), { cache: "no-store" });
      const data = await res.json();

      const incoming = data.products ?? [];

      if (typeof data.total === "number") {
        setTotal(data.total);
      }

      if (p === 1) {
        setProducts(incoming);
      } else {
        addProducts(incoming);
      }

      setLastLoadedPage(p);
      setHasMore(Boolean(data.hasMore));
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  /* load when page changes */
  useEffect(() => {
    loadPage(page);
  }, [page]);

  /* ✅ iOS SAFE infinite scroll */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasMore &&
          !loadingRef.current
        ) {
          const next = pageRef.current + 1;
          pageRef.current = next;
          setPage(next);
        }
      },
      {
        root: null,          // MUST be null for iOS
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, setPage]);

  /* save scroll position */
  useEffect(() => {
    const save = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [setScrollY]);

  /* restore page */
  useEffect(() => {
    if (lastLoadedPage > 1) {
      setPage(lastLoadedPage);
      pageRef.current = lastLoadedPage;
    }
  }, []);

  /* restore scroll (Safari safe) */
  useEffect(() => {
    if (restoredRef.current || !products.length) return;
    restoredRef.current = true;

    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: "auto" });
    });
  }, [products, scrollY]);

  return {
    products,
    total,
    isLoading,
    isLoadingMore,
    loadMoreRef, // 👈 IMPORTANT
  };
}
