// movie.js

const movies = {
  'michael-clayton': {
    title: 'Майкл Клейтон (2007)',
    originalTitle: 'Michael Clayton',
    year: 2007,
    country: 'США',
    genre: 'Фільми, Трилери, Драми, Кримінал, Детективи',
    duration: '1 год 59 хв.',
    premiere: '12 липня 2007',
    quality: 'BDRip',
    poster: './images/foto-movies2.png',
    videoUrl: 'https://www.youtube.com/embed/eVgoZ3I1H9Y', // 🔴 заміни на свій
  },
  // Можеш додати інші фільми за ID
};

// Отримуємо id з URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const movie = movies[id];

if (movie) {
  const container = document.getElementById('movie-container');
  container.innerHTML = `
    <div class="movies-list-movie-card">
      <div class="foto-rating">
        <div class="movie-poster">
          <img src="${movie.poster}" class="movie-poster-img" alt="${movie.title}" />
        </div>
        <div class="movie-info-block">
          <div class="movie-meta">
            <h2 class="movie-title">${movie.title}</h2>
            <p><strong>Оригінальна назва:</strong> ${movie.originalTitle}</p>
            <p><strong>Рік:</strong> ${movie.year}</p>
            <p><strong>Країна:</strong> ${movie.country}</p>
            <p><strong>Жанр:</strong> ${movie.genre}</p>
            <p><strong>Тривалість:</strong> ${movie.duration}</p>
            <p><strong>Прем'єра (світ):</strong> ${movie.premiere}</p>
            <p><strong>Якість:</strong> ${movie.quality}</p>
          </div>
        </div>
      </div>
      <div class="video-player" style="margin-top: 30px;">
        <iframe width="100%" height="480" src="${movie.videoUrl}" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  `;
} else {
  document.getElementById('movie-container').innerHTML = '<p>Фільм не знайдено.</p>';
}