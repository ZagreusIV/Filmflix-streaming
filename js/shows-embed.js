document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "YOUR_API_KEY";

  const urlParams = new URLSearchParams(window.location.search);

  const showId = urlParams.get("id");

  fetch(
    `https://api.themoviedb.org/3/tv/${showId}?api_key=${apiKey}&language=en-US`
  )
    .then((response) => response.json())
    .then((show) => {
      const showEmbed = document.getElementById("show-embed");

      document.title = show.name;

      const iframe = document.createElement("iframe");

      iframe.src = `https://vidstreaming.cam/embed/tv/${showId}?season=1&episode=1`;

      showEmbed.appendChild(iframe);

      iframe.width = "100%";
      iframe.height = "100%";
      iframe.allowFullscreen = true;

      const showInfoDiv = document.createElement("div");

      showInfoDiv.classList.add("show-info");

      showInfoDiv.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${
              show.poster_path
            }" alt="${show.name}" class="show-poster">
            <p class="content-title"><a href="https://www.themoviedb.org/tv/${showId}" target="_blank">${
        show.name
      }</a><br></p>
            <p class="relase-date">(${show.first_air_date.substring(
              0,
              4
            )} - ${show.last_air_date.substring(0, 4)})</p>
            <p><span class="details-title"></span><span class="details-desc" id="details-rating">${show.vote_average.toFixed(
              1
            )}</span></p>
            <p><span class="details-title">Overview: </span><br><span class="details-desc">${
              show.overview
            }</span></p>
        `;

      const infoContainer = document.getElementById("show-info-container");

      infoContainer.appendChild(showInfoDiv);
    })
    .catch((error) => console.error("Error fetching show details:", error));
});
