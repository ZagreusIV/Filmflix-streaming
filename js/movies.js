document.addEventListener("DOMContentLoaded", () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer YOUR_API_TOKEN",
    },
  };

  let currentPage = 1;
  const totalPages = 500;

  function fetchMovies(page) {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        let movies = response.results;

        movies.sort((a, b) => b.vote_average - a.vote_average);

        const movieContainer = document.querySelector(".movie-container");

        movieContainer.innerHTML = "";

        movies.forEach((movie) => {
          const filmContainer = document.createElement("div");
          filmContainer.classList.add("film-container");

          const movieLink = document.createElement("a");
          movieLink.href = `result-embed.html?id=${movie.id}`;

          const posterImageContainer = document.createElement("div");
          posterImageContainer.classList.add("poster-image-container");

          const posterImage = document.createElement("img");
          posterImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          posterImage.alt = movie.title;
          posterImage.classList.add("film-image");

          const rating = document.createElement("div");
          rating.classList.add("rating");
          if (movie.vote_average == 0) {
            rating.textContent = `Upcoming`;
          } else rating.textContent = `${movie.vote_average.toFixed(1)}`;

          posterImageContainer.appendChild(posterImage);
          posterImageContainer.appendChild(rating);

          const title = document.createElement("p");
          title.textContent = movie.title;
          title.classList.add("film-info");
          title.classList.add("movie-title");

          movieLink.appendChild(posterImageContainer);
          filmContainer.appendChild(movieLink).appendChild(title);
          movieContainer.appendChild(filmContainer);
        });
      })
      .catch((err) => console.error(err));
  }

  function createPaginationButtons() {
    const pageNumbers = document.getElementById("page-numbers");
    pageNumbers.innerHTML = "";

    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, startPage + 6);

    const prevPageButton = document.createElement("button");
    prevPageButton.textContent = "◄";
    prevPageButton.classList.add("page");
    prevPageButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage);
        createPaginationButtons();
      }
    });
    pageNumbers.appendChild(prevPageButton);

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.classList.add("page");
      if (i === currentPage) {
        button.classList.add("current");
      }
      button.addEventListener("click", () => {
        currentPage = i;
        fetchMovies(currentPage);
        createPaginationButtons();
      });
      pageNumbers.appendChild(button);
    }

    const nextPageButton = document.createElement("button");
    nextPageButton.textContent = "►";
    nextPageButton.classList.add("page");
    nextPageButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentPage);
        createPaginationButtons();
      }
    });
    pageNumbers.appendChild(nextPageButton);
  }

  fetchMovies(currentPage);
  createPaginationButtons();
});
