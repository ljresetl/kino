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
    tmdb: { rating: 6.787, votes: 1804 }
  };
  function generateStars(rating) {
    const stars = [], fiveScale = rating / 2;
    for (let i = 0; i < 5; i++) {
      if (fiveScale >= i + 1) stars.push("★");
      else if (fiveScale > i && fiveScale < i + 1) stars.push("☆");
      else stars.push("✩");
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

  // === 3. Мобільне меню ===
  const navBtn = document.querySelector('.nav-toggle-btn');
  const navPanel = document.querySelector('.navigation-panel');
  const navClose = document.querySelector('.nav-close-btn');
  if (navBtn && navPanel && navClose) {
    navBtn.addEventListener('click', () => navPanel.classList.remove('hidden'));
    navClose.addEventListener('click', () => navPanel.classList.add('hidden'));
  }

  // === 4. Відкриття/закриття фільтрів + вибір пункту ===
  const filterToggles = document.querySelectorAll('.filter-toggle');
  const filters = {}; // Об'єкт фільтрів
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      // Закриваємо всі інші підменю
      filterToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          const menu = otherToggle.nextElementSibling;
          if (menu && menu.classList.contains('filter-menu')) {
            menu.classList.add('hidden');
          }
        }
      });

      // Відкриваємо або закриваємо поточне підменю
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains('filter-menu')) {
        menu.classList.toggle('hidden');
      }
    });

    const menu = toggle.nextElementSibling;
    if (menu) {
      const items = menu.querySelectorAll('li');
      items.forEach(item => {
        item.addEventListener('click', () => {
          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          const category = toggle.textContent.split(':')[0];
          toggle.textContent = `${category}: ${item.textContent}`;
          menu.classList.add('hidden');
          filters[category.toLowerCase()] = item.textContent;
          filterMovies(filters);
        });
      });
    }
  });

  // === 5. Обробка кліку по році окремо ===
  const yearToggle = document.querySelector('[data-filter="year"] .filter-toggle');
  const yearMenu = document.querySelector('[data-filter="year"] .filter-menu');
  if (yearMenu && yearToggle) {
    const yearItems = yearMenu.querySelectorAll('li');
    yearItems.forEach(item => {
      item.addEventListener('click', () => {
        yearItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const category = yearToggle.textContent.split(':')[0];
        yearToggle.textContent = `${category}: ${item.textContent}`;
        yearMenu.classList.add('hidden');
        filters['year'] = item.textContent;
        filterMovies(filters);
      });
    });
  }

  // === 6. Кнопка "ПІДІБРАТИ" ===
  const applyBtn = document.querySelector('.apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => filterMovies(filters));
  }

  // === 7. Кнопка "СКИНУТИ" ===
  const resetBtn = document.querySelector('.reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      Object.keys(filters).forEach(key => delete filters[key]);

      document.querySelectorAll('.filter-item').forEach(item => {
        const toggle = item.querySelector('.filter-toggle');
        const category = item.getAttribute('data-filter');

        // Задаємо правильні тексти за категоріями
        let defaultText = '';
        switch (category) {
          case 'genre': defaultText = 'Жанр'; break;
          case 'year': defaultText = 'Виберіть рік'; break;
          case 'country': defaultText = 'Країна'; break;
          case 'date': defaultText = 'По даті публікації'; break;
          default: defaultText = toggle.textContent.split(':')[0]; break;
        }

        toggle.textContent = defaultText;
        item.querySelectorAll('li').forEach(li => li.classList.remove('active'));
      });

      filterMovies(filters);
    });
  }

  // === Фільтрація фільмів ===
  function filterMovies(filters) {
    const moviesList = document.querySelector('.movies-list');
    if (!moviesList) return;

    let anyVisible = false;

    for (const movieEl of moviesList.children) {
      const year = movieEl.getAttribute('data-year');
      const genre = movieEl.getAttribute('data-genre');
      const country = movieEl.getAttribute('data-country');
      const date = movieEl.getAttribute('data-date');

      let visible = true;

      // Перевірка кожного активного фільтра
      if (filters.year && filters.year !== year) visible = false;
      if (filters.genre && filters.genre !== genre) visible = false;
      if (filters.country && filters.country !== country) visible = false;
      if (filters.date && filters.date !== date) visible = false;

      movieEl.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    }

    let msgEl = document.querySelector('.no-movies-msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'no-movies-msg';
      Object.assign(msgEl.style, {
        color: 'red',
        fontWeight: 'bold',
        marginTop: '20px'
      });
      msgEl.textContent = 'ФІЛЬМ НЕ ЗНАЙДЕНО';
      moviesList.parentNode.appendChild(msgEl);
    }
    msgEl.style.display = anyVisible ? 'none' : 'block';
  }
}

// Запуск init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
