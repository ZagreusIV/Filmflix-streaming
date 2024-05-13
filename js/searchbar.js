function handleSearch(event) {
  event.preventDefault();
  const searchTerm = document.getElementById("search-input").value;
  const apiKey = "YOUR_API_KEY";
  const url = `search-results.html?query=${searchTerm}&apiKey=${apiKey}`;
  window.location.href = url;
}
