document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  const embedUrl = `https://vidstreaming.cam/embed/movie/${movieId}`;

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.width = "800";
  iframe.height = "500";
  iframe.allowFullscreen = true;

  const embedContainer = document.getElementById("movie-embed-container");
  embedContainer.appendChild(iframe);

  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=YOUR_API_KEY`
  )
    .then((response) => response.json())
    .then((movie) => {
      document.title = movie.title;
      const movieInfoDiv = document.createElement("div");
      movieInfoDiv.classList.add("movie-info");

      movieInfoDiv.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${
                  movie.poster_path
                }" alt="${movie.title}" class="movie-poster">
                <p class="content-title"><a href="https://www.themoviedb.org/movie/${movieId}" target="_blank">${
        movie.title
      }</a></p>
                <p class="relase-date">(${movie.release_date.substring(
                  0,
                  4
                )})</p>
                <p><span class="details-title"></span><span class="details-desc" id="details-rating">${movie.vote_average.toFixed(
                  1
                )}</span></p>
                <p><span class="details-title">Overview: </span><br><span class="details-desc">${
                  movie.overview
                }</span></p>
            `;

      const infoContainer = document.getElementById("movie-info-container");
      infoContainer.appendChild(movieInfoDiv);
    })
    .catch((err) => console.error(err));
});
