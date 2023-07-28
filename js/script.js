const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "545a70ae79f25d96fef9281576557a1a",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    console.log(link);

    if (link.getAttribute("href") === global.currentPage) {
      console.log("hello");

      link.classList.add("active");
    }
  });
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();
  console.log(data);
  hideSpinner();
  return data;
}
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoint: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}
async function displaySlider() {
  const { results } = await fetchAPIData("/movie/now_playing");
  //console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `<a href="movie-details.html?id=${movie.movie_id}">
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 className="swiper-rating">
        <i className="fas fa-star text-secondary"></i>
        ${movie.vote_average}/10</h4>
        `;
    console.log(div);
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSwiper();
}
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" className="card-img-top" alt="${movie.title}" />`
        : `<img src="../images/no-image.jpg" className="card-img-top" alt="${movie.title}" />`
    }
    </a>
    <div className ="card-body">
        <h5 className="card-title">${movie.title}</h5>
        <p className="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
    </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="movie-details.html?id=${show.id}">
  ${
    show.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" className="card-img-top" alt="${show.title}" />`
      : `<img src="../images/no-image.jpg" className="card-img-top" alt="${show.title}" />`
  }
  </a>
  <div className ="card-body">
      <h5 className="card-title">${show.title}</h5>
      <p className="card-text">
      <small class="text-muted">Release: ${show.release_date}</small>
      </p>
  </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
}
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("error");
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
}
function displaySearchResults(results) {
  console.log(results);
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="${global.search.type}-details.html/id=${
      result.id
    }">
    ${
      result.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${
            result.poster_path
          }" alt="${
            global.search.type === "movie" ? result.title : result.name
          }" className="card-img-top" />`
        : `<img src="../images/no-image.jpg" alt="${result.poster_path}" />`
    }
    </a>
    <div class="card-body">
    <h5 class="card-title">${result.title}</h5>
    <p class="card-text"> 
    <small class="text-muted">Release: 
    ${
      global.search.type === "movie"
        ? result.release_date
        : result.first_air_date
    } 
    </small>
    </p>
    <div>`;
    document.querySelector("#search-results-heading").innerHTML = `<h2>
   ${results.length} of ${global.search.totalResults} Results for ${global.search.term}
   </h2>`;

    document.querySelector("#search-results").appendChild(div);
  });
}
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get("type"));
  console.log(urlParams.get("search-term"));
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  if (global.search.type !== "" && global.search.term !== "") {
    const { results, totalPages, totalResults, page } = await searchAPIData();
    global.search.page = page;
    global.search.term = totalPages;
    global.search.totalResults = totalresults;

    if (results.length == 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter search term");
  }
}
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      break;
    case "/tv-details.html":
      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init());
