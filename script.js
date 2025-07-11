function init() {
  // === 1. Перемикач теми ===
  const toggleBtn = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', initialTheme);
  if (toggleBtn) {
    toggleBtn.textContent = initialTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  // === 2. Оновлення рейтингу ===
  const data = {
    mainRating: 6.9,
    mainVotes: 330,
    imdb: { rating: 7.2, votes: "179 278" },
    tmdb: { rating: 6.787, votes: 1804 },
  };

  function generateStars(rating) {
    const stars = [];
    const fiveScale = rating / 2;
    for (let i = 0; i < 5; i++) {
      stars.push(fiveScale >= i + 1 ? "★"
        : fiveScale > i && fiveScale < i + 1 ? "☆" : "✩");
    }
    return stars.join("");
  }

  const elNum = document.querySelector(".rating-number-kino");
  const elStars = document.querySelector(".rating-stars-kino");
  const elVotes = document.querySelector(".rating-votes-kino");
  const elImdb = document.querySelector(".imdb-rating");
  const elTmdb = document.querySelector(".tmdb-rating");

  if (elNum) elNum.textContent = data.mainRating.toFixed(1);
  if (elStars) elStars.textContent = generateStars(data.mainRating);
  if (elVotes) elVotes.textContent = `Голосів: ${data.mainVotes}`;
  if (elImdb) elImdb.textContent = `${data.imdb.rating} (${data.imdb.votes})`;
  if (elTmdb) elTmdb.textContent = `${data.tmdb.rating.toFixed(3)} (${data.tmdb.votes})`;

  // === 3. Логіка відкриття/закриття меню ===
  const navBtn = document.querySelector('.nav-toggle-btn');
  const navPanel = document.querySelector('.navigation-panel');
  const navClose = document.querySelector('.nav-close-btn');

  if (navBtn && navPanel && navClose) {
    navBtn.addEventListener('click', () => {
      navPanel.classList.remove('hidden');
    });

    navClose.addEventListener('click', () => {
      navPanel.classList.add('hidden');
    });
  }
}

// Виконати init() або після події, або одразу, якщо DOM вже завантажений
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
