document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("query");
  const apiKey = urlParams.get("apiKey");
  const sortBy = "popularity.desc";
  let currentPage = 1;
  let totalPages = 7;

  function fetchResults(page) {
    const url = `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${apiKey}&sort_by=${sortBy}&page=${page}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const searchContainer = document.getElementById("search-results");
        searchContainer.innerHTML = "";

        data.results.forEach((result) => {
          const resultDiv = document.createElement("div");
          resultDiv.classList.add("result-div");

          const resultLink = document.createElement("a");
          if (result.media_type === "movie") {
            resultLink.href = `result-embed.html?id=${result.id}`;
          } else if (result.media_type === "tv") {
            resultLink.href = `shows-embed.html?id=${result.id}`;
          } else {
            resultLink.href = "";
          }

          const posterImage = document.createElement("img");
          posterImage.src = result.poster_path
            ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
            : "https://via.placeholder.com/200x300";
          posterImage.alt = result.title || result.name;
          posterImage.classList.add("result-image");

          if (result.media_type === "movie") {
            const rating = document.createElement("div");
            rating.classList.add("rating");
            if (result.vote_average == 0) {
              rating.textContent = `Upcoming`;
            } else {
              rating.textContent = `${result.vote_average.toFixed(1)}`;
            }
            resultDiv.appendChild(posterImage);
            resultDiv.appendChild(rating);
          } else if (result.media_type === "tv") {
            const rating = document.createElement("div");
            rating.classList.add("rating");
            if (result.vote_average == 0) {
              rating.textContent = "Upcoming";
            } else {
              rating.textContent = `${result.vote_average.toFixed(1)}`;
              const ratingContainer = document.createElement("div");
              ratingContainer.classList.add("rating-container");
              ratingContainer.appendChild(rating);
              resultDiv.appendChild(posterImage);
              resultDiv.appendChild(ratingContainer);
            }
          }

          const title = document.createElement("p");
          title.textContent = result.title || result.name;
          title.classList.add("result-info");
          title.classList.add("result-title");

          resultLink.appendChild(resultDiv);
          resultDiv.appendChild(title);
          searchContainer.appendChild(resultLink);
        });

        totalPages = data.total_pages;
        createPaginationButtons();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function createPaginationButtons() {
    const pageNumbers = document.getElementById("page-numbers");
    pageNumbers.innerHTML = "";

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    const prevPageButton = document.createElement("button");
    prevPageButton.textContent = "◄";
    prevPageButton.classList.add("page");
    prevPageButton.classList.add("previous-page");
    prevPageButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchResults(currentPage);
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
        fetchResults(currentPage);
        createPaginationButtons();
      });
      pageNumbers.appendChild(button);
    }

    const nextPageButton = document.createElement("button");
    nextPageButton.textContent = "►";
    nextPageButton.classList.add("page");
    nextPageButton.classList.add("next-page");
    nextPageButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchResults(currentPage);
        createPaginationButtons();
      }
    });
    pageNumbers.appendChild(nextPageButton);
  }

  fetchResults(currentPage);
});
