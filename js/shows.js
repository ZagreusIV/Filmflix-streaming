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

  function fetchShows(page) {
    fetch(
      `https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=${page}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        let shows = response.results;

        shows.sort((a, b) => b.vote_average - a.vote_average);

        const showContainer = document.querySelector(".show-container");

        showContainer.innerHTML = "";

        shows.forEach((show) => {
          const showDiv = document.createElement("div");
          showDiv.classList.add("show-div");

          const showLink = document.createElement("a");
          showLink.href = `shows-embed.html?id=${show.id}`;

          const posterContainer = document.createElement("div");
          posterContainer.classList.add("poster-container");

          const posterImage = document.createElement("img");
          posterImage.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
          posterImage.alt = show.name;
          posterImage.classList.add("show-image");

          const rating = document.createElement("div");
          rating.classList.add("rating");
          if (show.vote_average == 0) {
            rating.textContent = "Upcoming";
          } else {
            rating.textContent = `${show.vote_average.toFixed(1)}`;
          }
          showDiv.appendChild(rating);

          const title = document.createElement("p");
          title.textContent = show.name;
          title.classList.add("show-info");
          title.classList.add("show-title");

          const ratingContainer = document.createElement("div");
          ratingContainer.classList.add("rating-container");
          ratingContainer.appendChild(rating);
          posterContainer.appendChild(posterImage);
          posterContainer.appendChild(ratingContainer);

          showLink.appendChild(posterContainer);
          showDiv.appendChild(showLink).appendChild(title);
          showContainer.appendChild(showDiv);
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
        fetchShows(currentPage);
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
        fetchShows(currentPage);
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
        fetchShows(currentPage);
        createPaginationButtons();
      }
    });
    pageNumbers.appendChild(nextPageButton);
  }

  fetchShows(currentPage);
  createPaginationButtons();
});
