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

  // === 4. Фільтри ===
  const filterToggles = document.querySelectorAll('.filter-toggle');
  const filters = { genre: '', country: '', year: '', date: '' };
  const filterLabels = { genre: 'Жанр', country: 'Країна', year: 'Рік', date: 'Дата' };

  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      filterToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          const menu = otherToggle.nextElementSibling;
          if (menu?.classList.contains('filter-menu')) menu.classList.add('hidden');
        }
      });
      const menu = toggle.nextElementSibling;
      if (menu?.classList.contains('filter-menu')) menu.classList.toggle('hidden');
    });

    const menu = toggle.nextElementSibling;
    if (menu) {
      const items = menu.querySelectorAll('li');
      items.forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          const category = toggle.closest('.filter-item')?.getAttribute('data-filter') || '';
          if (category) {
            const label = filterLabels[category] || capitalize(category);
            toggle.textContent = `${label} - ${item.textContent.trim()}`;
            filters[category] = item.textContent.trim();
          }
          menu.classList.add('hidden');
        });
      });
    }
  });

  document.addEventListener('click', () => {
    filterToggles.forEach(toggle => {
      const menu = toggle.nextElementSibling;
      if (menu?.classList.contains('filter-menu')) menu.classList.add('hidden');
    });
  });

  // === 5. Кнопка "Підібрати" ===
  const applyBtn = document.querySelector('.apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      resetSearchInput();
      console.log('--- Фільтрація ---');
      console.log('Filters:', filters);
      filterMovies(filters);
    });
  }

  // === 6. Кнопка "Скинути" ===
  const resetBtn = document.querySelector('.reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetFilters();
      resetSearchInput();
    });
  }

  // === 7. Повідомлення "ФІЛЬМ НЕ ЗНАЙДЕНО" ===
  const moviesList = document.querySelector('.movies-list');
  const moviesContainer = document.querySelector('.container-movie-list');
  if (moviesList && !document.querySelector('.no-movies-msg')) {
    const msgEl = document.createElement('div');
    msgEl.className = 'no-movies-msg';
    msgEl.textContent = 'ФІЛЬМ НЕ ЗНАЙДЕНО';
    Object.assign(msgEl.style, {
      color: 'red',
      fontWeight: 'bold',
      marginTop: '20px',
      display: 'none'
    });
    (moviesList.parentNode || moviesList).appendChild(msgEl);
  }

  // === 8. Фільтрація фільмів ===
  function filterMovies(filters) {
    if (!moviesList) return;
    let anyVisible = false;
    const movieCards = Array.from(moviesList.querySelectorAll('.movies-list-movie-card'));

    movieCards.forEach(movieEl => {
      const year = (movieEl.getAttribute('data-year') || '').toLowerCase();
      const genre = (movieEl.getAttribute('data-genre') || '').toLowerCase();
      const country = (movieEl.getAttribute('data-country') || '').toLowerCase();
      const date = (movieEl.getAttribute('data-date') || '').toLowerCase();

      let visible = true;
      for (const [key, val] of Object.entries(filters)) {
        if (!val) continue;
        const valLower = val.toLowerCase();
        switch (key) {
          case 'year':
            if (year !== valLower) visible = false;
            break;
          case 'genre':
            if (!genre.split(',').map(s => s.trim()).includes(valLower)) visible = false;
            break;
          case 'country':
            if (!country.split(',').map(s => s.trim()).includes(valLower)) visible = false;
            break;
          case 'date':
            break;
        }
        if (!visible) break;
      }

      movieEl.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;

      const metaEl = movieEl.querySelector('.movie-meta');
      if (metaEl) {
        metaEl.innerHTML = metaEl.textContent;
        let html = metaEl.innerHTML;
        for (const [key, val] of Object.entries(filters)) {
          if (!val) continue;
          const regex = new RegExp(`(${escapeRegExp(val)})`, 'gi');
          html = html.replace(regex, '<span style="color:red;">$1</span>');
        }
        metaEl.innerHTML = html;
      }
    });

    if (filters.date) {
      const sortDescending = filters.date === 'Спочатку нові';
      const visibleMovies = movieCards.filter(el => el.style.display !== 'none');
      visibleMovies.sort((a, b) => {
        const yearA = parseInt(a.getAttribute('data-year')) || 0;
        const yearB = parseInt(b.getAttribute('data-year')) || 0;
        return sortDescending ? yearB - yearA : yearA - yearB;
      });
      visibleMovies.forEach(movie => {
        moviesContainer.appendChild(movie);
      });
    }

    const msgEl = document.querySelector('.no-movies-msg');
    if (msgEl) {
      msgEl.style.display = anyVisible ? 'none' : 'block';
    }
  }

  // === 9. Пошук по назві фільму (сумісний з фільтрами) ===
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-btn'); // Додаємо кнопку

function performSearch() {
  clearFiltersUI();
  const query = searchInput.value.toLowerCase().trim();
  const movieCards = document.querySelectorAll('.movies-list-movie-card');

  let anyVisible = false;

  movieCards.forEach(card => {
    const titleEl = card.querySelector('.movie-title');
    if (!titleEl) return;

    const fullTitle = titleEl.textContent.toLowerCase();
    const cleanedTitle = fullTitle.replace(/\(\s*\d{4}\s*\)/, '').trim();

    const match = fullTitle.includes(query) || cleanedTitle.includes(query);
    card.style.display = match ? '' : 'none';

    if (match) anyVisible = true;
  });

  const msgEl = document.querySelector('.no-movies-msg');
  if (msgEl) {
    msgEl.style.display = anyVisible ? 'none' : 'block';
  }
}

// Виконуємо пошук при наборі
searchInput.addEventListener('input', performSearch);

// Виконуємо пошук при кліку на кнопку
searchButton.addEventListener('click', performSearch);


  // === 10. Скидання фільтрів ===
  function resetFilters() {
    Object.keys(filters).forEach(key => filters[key] = '');
    document.querySelectorAll('.filter-item').forEach(item => {
      const toggle = item.querySelector('.filter-toggle');
      const category = item.getAttribute('data-filter');
      let defaultText = '';
      switch (category) {
        case 'genre': defaultText = 'Жанр'; break;
        case 'year': defaultText = 'Виберіть рік'; break;
        case 'country': defaultText = 'Країна'; break;
        case 'date': defaultText = 'По даті публікації'; break;
        default: defaultText = capitalize(category); break;
      }
      if (toggle) toggle.textContent = defaultText;
      item.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    });
    filterMovies(filters);
  }

  // Скидаємо інпут пошуку
  function resetSearchInput() {
    if (searchInput) {
      searchInput.value = '';
      const movieCards = moviesList.querySelectorAll('.movies-list-movie-card');
      movieCards.forEach(card => card.style.display = '');
      const msgEl = document.querySelector('.no-movies-msg');
      if (msgEl) msgEl.style.display = 'none';
    }
  }

  // Очищуємо UI фільтрів при пошуку
  function clearFiltersUI() {
    Object.keys(filters).forEach(key => filters[key] = '');
    document.querySelectorAll('.filter-item').forEach(item => {
      const toggle = item.querySelector('.filter-toggle');
      const category = item.getAttribute('data-filter');
      let defaultText = '';
      switch (category) {
        case 'genre': defaultText = 'Жанр'; break;
        case 'year': defaultText = 'Виберіть рік'; break;
        case 'country': defaultText = 'Країна'; break;
        case 'date': defaultText = 'По даті публікації'; break;
        default: defaultText = capitalize(category); break;
      }
      if (toggle) toggle.textContent = defaultText;
      item.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // === 11. Початкове скидання фільтрів і пошуку ===
  resetFilters();
  resetSearchInput();
}

// === Запуск після завантаження DOM ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Обробник кліку на картку фільму
document.querySelectorAll('.movies-list-movie-card').forEach(card => {
  card.addEventListener('click', () => {
    const movieId = card.dataset.id;
    if (movieId) {
      window.location.href = `movie.html?id=${movieId}`;
    }
  });
});
