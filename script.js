const display = document.getElementById("display");
// const showGame = document.querySelector(".show-game");
const search = document.getElementById("search");
const searchInput = document.getElementById("search-form");
const moveDisplay = document.querySelector(".move-display");
const pageNumber = document.querySelector("#page-number");
const btnBack = document.querySelector("#back");
const titleGame = document.getElementById("title-game");
let page = 1;
let maxPage = 1;
let genresCurent = "";
let searchCurent = "";
const ulCategoryGroup = document.querySelector(".category-group");

const previous = document.querySelector(".previous");
const next = document.querySelector(".next");

function setPageMax(total) {
  maxPage = Math.floor(total / 35) + 1;
}
function displayPageNumber() {
  pageNumber.innerHTML = page;
}

const getDataGame = async (genres, search) => {
  try {
    let url = "";
    if (genres === "" && search === "") {
      url = `https://steam-api-mass.onrender.com/games?limit=35&page=${page}`;
    } else if (genres === "") {
      url = `https://steam-api-mass.onrender.com/games?limit=35&q=${search}&page=${page}`;
      console.log(url);
    } else {
      url = `https://steam-api-mass.onrender.com/games?limit=35&genres=${genres}&page=${page}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setPageMax(data.total);
    displayPageNumber();
    if (genres === "" && search === "") {
      titleGame.textContent = `ALL GAME (Total:${data.total} on ${maxPage} Pages)`;
    } else if (genres === "") {
      titleGame.textContent = `${searchCurent.toUpperCase()} (Total:${
        data.total
      } on ${maxPage} Pages)`;
    } else {
      titleGame.textContent = `${genresCurent.toUpperCase()} (Total:${
        data.total
      } on ${maxPage} Pages)`;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};
const getDataGenres = async () => {
  try {
    const url = "https://steam-api-mass.onrender.com/genres?limit=100";
    const res = await fetch(url);
    const data = await res.json();
    // console.log(res);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getDataGameDetail = async (appid) => {
  try {
    const url = `https://steam-api-mass.onrender.com/single-game/${appid}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(url);
    console.log(res);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
// getDataGame();
// getDataGenres();
// getDataTagsList();
const appDetail = async (id) => {
  const data = await getDataGameDetail(id);
  renderDetail(data);
};
function renderDetail(dt) {
  display.innerHTML = "";
  moveDisplay.classList.add("hidden");
  btnBack.classList.remove("hidden");
  const newDiv = document.createElement("div");
  const data = dt.data;
  let innerHTML = `<div class="showing_game show_detail">
    <div class="title_contain ">
    <div class="title"></div>
    <div class="price">${data.price} USD</div>
    </div>
    <div class="img_detail">
    <img
    src="${data.header_image}"
    alt=""
    />
    <div class="game_details">
    <div class="game_description">${data.description}</div>
    <div class="game_informations">
    <p>RELEASE DATE:  ${data.release_date}</p>
    <p>DEVELOPER: ${data.developer[0]} </p>

    </div>
    </div>
    </div>
    <div class="tags_contain">
    Popular user-defined tags for this product:
    <div class="tags">
    <div class="tag"><p>${data.steamspy_tags[0]}</p></div>
    <div class="tag"><p>${data.steamspy_tags[1]}</p></div>
    <div class="tag"><p>${data.steamspy_tags[2]}</p></div>
    
    </div>
    </div>
    </div>
    `;
  console.log(innerHTML);
  newDiv.innerHTML = innerHTML;
  display.appendChild(newDiv);
  display.style.backgroundImage = `url(${data.background})`;
}

function renderGame(el) {
  const newDiv = document.createElement("div");
  let innerHTML = `<div class="game_wrapper">
    <div class="cover" onClick="appDetail(${el["appid"]})">
    <img
    src="${el["header_image"]}" data-id="${el["appid"]}"
    />
    <div class="game_info">
    <p>${el["price"]} USD</p>
    </div>
    </div>
    </div>`;
  newDiv.innerHTML = innerHTML;
  display.appendChild(newDiv);
}
const renderDisplay = async (genres, search) => {
  const data = await getDataGame(genres, search);
  display.innerHTML = "";
  console.log(data);
  let dt = data["data"];
  console.log(dt);
  dt.forEach((e) => {
    renderGame(e);
  });
};
const renderCategory = async () => {
  const data = await getDataGenres();
  ulCategoryGroup.innerHTML = "";
  console.log("here");
  console.log(ulCategoryGroup);
  data.data.forEach((e) => {
    const li = document.createElement("li");
    li.textContent = `${e["name"]}`.toUpperCase();
    li.addEventListener("click", () => {
      page = 1;
      genresCurent = li.textContent.toLowerCase();
      searchCurent = "";
      searchInput.value = "";
      btnBack.classList.add("hidden");
      moveDisplay.classList.remove("hidden");
      renderDisplay(genresCurent, searchCurent);
    });
    ulCategoryGroup.appendChild(li);
  });
};
search.addEventListener("click", () => {
  searchCurent = searchInput.value.trim();
  genresCurent = "";
  page = 1;
  renderDisplay(genresCurent, searchCurent);
});
previous.addEventListener("click", () => {
  if (page > 1) {
    page -= 1;
    renderDisplay(genresCurent, searchCurent);
  }
});
next.addEventListener("click", () => {
  if (page < maxPage) {
    page += 1;
    renderDisplay(genresCurent, searchCurent);
  }
});
btnBack.addEventListener("click", () => {
  btnBack.classList.add("hidden");
  moveDisplay.classList.remove("hidden");
  renderDisplay(genresCurent, searchCurent);
});
renderDisplay("", "");
renderCategory();
