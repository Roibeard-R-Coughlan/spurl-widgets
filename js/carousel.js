"use strict";

/* =========================================================
   SECTION 1 - Shared Utilities
   Reusable carousel controller with isolated state per instance.
   Carousel-specific behaviour is passed through options only.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getGap = (element) => {
    const gap = window.getComputedStyle(element).columnGap || window.getComputedStyle(element).gap;
    return Number.parseFloat(gap) || 0;
  };

  const getVisibleCards = () => {
    const isTabletPortrait = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)"
    ).matches;

    if (window.innerWidth < 768) return 1;
    if (isTabletPortrait) return 1;
    if (window.innerWidth < 1100) return 2;
    return 3;
  };

  const createCarousel = ({
    rootSelector,
    trackSelector,
    cardSelector,
    prevSelector,
    nextSelector,
    loop = false,
    autoplay = false,
    autoplayDelay = 4000,
    enableKeyboard = true,
    enableSwipe = true
  }) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const track = root.querySelector(trackSelector);
    const cards = Array.from(root.querySelectorAll(cardSelector));
    const prevButton = root.querySelector(prevSelector);
    const nextButton = root.querySelector(nextSelector);

    if (!track || cards.length === 0 || !prevButton || !nextButton) return;

    let activeIndex = 0;
    let autoplayTimer = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let resizeFrame = null;

    const visibleCount = () => clamp(getVisibleCards(), 1, cards.length);
    const maxIndex = () => Math.max(0, cards.length - visibleCount());

    const step = () => {
      const cardWidth = cards[0].getBoundingClientRect().width;
      return cardWidth + getGap(track);
    };

    const updateButtons = () => {
      if (loop) {
        prevButton.disabled = false;
        nextButton.disabled = false;
        prevButton.removeAttribute("aria-disabled");
        nextButton.removeAttribute("aria-disabled");
        return;
      }

      const lastIndex = maxIndex();
      prevButton.disabled = activeIndex === 0;
      nextButton.disabled = activeIndex === lastIndex;
      prevButton.setAttribute("aria-disabled", String(prevButton.disabled));
      nextButton.setAttribute("aria-disabled", String(nextButton.disabled));
    };

    const update = () => {
      activeIndex = clamp(activeIndex, 0, maxIndex());
      track.style.transform = `translate3d(-${activeIndex * step()}px, 0, 0)`;
      updateButtons();
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      if (!autoplay || prefersReducedMotion.matches || cards.length <= visibleCount()) return;

      stopAutoplay();

      autoplayTimer = window.setInterval(() => {
        goToNext(false);
      }, autoplayDelay);
    };

    const restartAutoplay = () => {
      if (!autoplay) return;
      startAutoplay();
    };

    const goToPrevious = (manual = true) => {
      if (activeIndex > 0) {
        activeIndex -= 1;
      } else if (loop) {
        activeIndex = maxIndex();
      }

      update();
      if (manual) restartAutoplay();
    };

    const goToNext = (manual = true) => {
      const lastIndex = maxIndex();

      if (activeIndex < lastIndex) {
        activeIndex += 1;
      } else if (loop) {
        activeIndex = 0;
      }

      update();
      if (manual) restartAutoplay();
    };

    const handleResize = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);

      resizeFrame = window.requestAnimationFrame(() => {
        update();
        restartAutoplay();
      });
    };

    prevButton.addEventListener("click", () => goToPrevious(true));
    nextButton.addEventListener("click", () => goToNext(true));

    if (enableKeyboard) {
      root.setAttribute("tabindex", "0");

      root.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goToPrevious(true);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          goToNext(true);
        }
      });
    }

    if (enableSwipe) {
      track.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse") return;

        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
      });

      track.addEventListener("pointerup", (event) => {
        if (event.pointerType === "mouse") return;

        const deltaX = pointerStartX - event.clientX;
        const deltaY = pointerStartY - event.clientY;

        if (Math.abs(deltaY) > Math.abs(deltaX)) return;
        if (Math.abs(deltaX) < 45) return;

        if (deltaX > 0) {
          goToNext(true);
        } else {
          goToPrevious(true);
        }
      });
    }

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", startAutoplay);

    window.addEventListener("resize", handleResize, { passive: true });

    if (prefersReducedMotion.matches) {
      track.style.transition = "none";
    }

    update();
    startAutoplay();
  };

  /* =========================================================
     SECTION 2 - Pitches Carousel
     Controls homepage pitch cards.
     Autoplays every 4 seconds and loops continuously.
  ========================================================= */

  createCarousel({
    rootSelector: ".pitches-carousel",
    trackSelector: "[data-carousel-track]",
    cardSelector: ".pitch-card",
    prevSelector: "[data-carousel-prev]",
    nextSelector: "[data-carousel-next]",
    loop: true,
    autoplay: true,
    autoplayDelay: 4000
  });

  /* =========================================================
     SECTION 3 - Heritage Carousel
     Controls the heritage timeline cards.
     Uses the shared controller but keeps separate state.
  ========================================================= */

  createCarousel({
    rootSelector: ".heritage-carousel",
    trackSelector: "[data-carousel-track]",
    cardSelector: ".timeline-card",
    prevSelector: "[data-carousel-prev]",
    nextSelector: "[data-carousel-next]",
    loop: false,
    autoplay: false
  });

  /* =========================================================
     SECTION 4 - Players Carousel
     Controls legendary player cards.
     Buttons stay outside the moving track.
  ========================================================= */

  createCarousel({
    rootSelector: ".players-carousel",
    trackSelector: "[data-carousel-track]",
    cardSelector: ".player-card",
    prevSelector: "[data-carousel-prev]",
    nextSelector: "[data-carousel-next]",
    loop: false,
    autoplay: false
  });
});