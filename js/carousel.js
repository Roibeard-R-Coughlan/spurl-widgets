document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const cards = document.querySelectorAll(".carousel-card");
  if (!track || cards.length === 0) return;

  const prevButton = document.getElementById("carouselPrev");
  const nextButton = document.getElementById("carouselNext");
  const toggleButton = document.getElementById("carouselToggle");
  const status = document.getElementById("carouselStatus");

  const heritageTrack = document.querySelector(".heritage-track");
  const playerTrack = document.querySelector(".player-track");

  const playerPrev = document.getElementById("playerPrev");
  const playerNext = document.getElementById("playerNext");

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

//  Carousel buttons for heritage page
if (playerNext) {
  playerNext.addEventListener("click", () => {

    if (activeIndex < maxIndex()) {
      activeIndex++;
    } else {
      activeIndex = 0;
    }

    updateCarousel();
  });
}

if (playerPrev) {
  playerPrev.addEventListener("click", () => {

    if (activeIndex > 0) {
      activeIndex--;
    } else {
      activeIndex = maxIndex();
    }

    updateCarousel();
  });
}

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

/* ==========================
   PLAYERS CAROUSEL
========================== */

const playerTrack = document.querySelector(".player-track");
const playerCards = document.querySelectorAll(".player-card");

const playerPrev = document.getElementById("playerPrev");
const playerNext = document.getElementById("playerNext");

if (playerTrack && playerCards.length) {

  let playerIndex = 0;

  const visiblePlayers = () => {

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

  const playerMaxIndex = () => {
    return playerCards.length - visiblePlayers();
  };

  const playerStep = () => {
    return playerCards[0].getBoundingClientRect().width +
      parseFloat(getComputedStyle(playerTrack).gap);
  };

  const updatePlayers = () => {

    playerTrack.style.transform =
      `translateX(-${playerIndex * playerStep()}px)`;

  };

  if (playerNext) {

    playerNext.addEventListener("click", () => {

      if (playerIndex < playerMaxIndex()) {
        playerIndex++;
      } else {
        playerIndex = 0;
      }

      updatePlayers();

    });

  }

  if (playerPrev) {

    playerPrev.addEventListener("click", () => {

      if (playerIndex > 0) {
        playerIndex--;
      } else {
        playerIndex = playerMaxIndex();
      }

      updatePlayers();

    });

  }

  window.addEventListener("resize", () => {

    if (playerIndex > playerMaxIndex()) {
      playerIndex = playerMaxIndex();
    }

    updatePlayers();

  });
  
}
// Players carousel swipe support

let playerStartX = 0;
let playerEndX = 0;

if (playerTrack) {

  playerTrack.addEventListener("touchstart", (e) => {
    playerStartX = e.touches[0].clientX;
  });

  playerTrack.addEventListener("touchend", (e) => {

    playerEndX = e.changedTouches[0].clientX;

    const swipeDistance =
      playerStartX - playerEndX;

    // Swipe left
    if (swipeDistance > 50) {

      if (playerIndex < playerMaxIndex()) {
        playerIndex++;
      } else {
        playerIndex = 0;
      }

      updatePlayers();
    }

    // Swipe right
    if (swipeDistance < -50) {

      if (playerIndex > 0) {
        playerIndex--;
      } else {
        playerIndex = playerMaxIndex();
      }

      updatePlayers();
    }

  });

}
