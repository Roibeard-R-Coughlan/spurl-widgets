document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const cards = document.querySelectorAll(".carousel-card");
  if (!track || cards.length === 0) return;

  const prevButton = document.getElementById("carouselPrev");
  const nextButton = document.getElementById("carouselNext");
  const toggleButton = document.getElementById("carouselToggle");
  const status = document.getElementById("carouselStatus");

  let activeIndex = 0;
  let isPlaying = true;
  let autoPlay;

  const visibleCards = () => {
  if (window.innerWidth < 768) return 1;

  if (
      window.innerWidth < 900 &&
      window.innerWidth > window.innerHeight
  ) {
      return 2;
  }

  if (window.innerWidth < 1100) return 2;

  return 3;
};

  const maxIndex = () => {
    return cards.length - visibleCards();
  };

  const getStep = () => {
  return cards[0].getBoundingClientRect().width +
         parseFloat(getComputedStyle(track).gap);
};

  const updateCarousel = () => {
    track.style.transform =
        `translateX(-${activeIndex * getStep()}px)`;

    if (status) {
  status.textContent =
    `${activeIndex + 1} of ${cards.length}`;
}};

  const startAutoPlay = () => {
    autoPlay = setInterval(() => {

      if (activeIndex < maxIndex()) {
        activeIndex++;
      } else {
        activeIndex = 0;
      }

      updateCarousel();

    }, 6000);
  };

  track.addEventListener("mouseenter", () => {
  clearInterval(autoPlay);
});

track.addEventListener("mouseleave", () => {
  if (isPlaying) {
    startAutoPlay();
  }
});

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (activeIndex < maxIndex()) {
      activeIndex++;
      updateCarousel();
    }
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (activeIndex > 0) {
      activeIndex--;
      updateCarousel();
    }
  });
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {

    if (isPlaying) {

      clearInterval(autoPlay);

      toggleButton.textContent = "▶";

      isPlaying = false;

    } else {

      startAutoPlay();

      toggleButton.textContent = "❚❚";

      isPlaying = true;
    }

  });
}

  startAutoPlay();

  window.addEventListener("resize", () => {

  if (activeIndex > maxIndex()) {
    activeIndex = maxIndex();
  }

  updateCarousel();

});

//  Test a swipe gesture on mobile devices
let startX = 0;
let endX = 0;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;

  const swipeDistance = startX - endX;

  // Swipe left
  if (swipeDistance > 50) {
    if (activeIndex < maxIndex()) {
      activeIndex++;
    } else {
      activeIndex = 0;
    }
    updateCarousel();
  }

  // Swipe right
  if (swipeDistance < -50) {
    if (activeIndex > 0) {
      activeIndex--;
    }
    updateCarousel();
  }
  });
});
