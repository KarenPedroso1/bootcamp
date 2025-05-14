document.addEventListener("DOMContentLoaded", main);

async function main() {
  await loadMainContent(1);
  await renderFooterData();
}

async function loadMainContent(page) {
  const result = await listCharactersByPage(page);
  const characters = result.charactersList;

  await renderCharactersList(characters);
  renderPagination(result.prevPage, result.nextPage);
}

async function renderCharactersList(characters) {
  const row = document.getElementById("list-characters");
  row.innerHTML = "";

  for (const character of characters) {
    let nameCharacter = character.name;

    if (nameCharacter.length > 18) {
      nameCharacter = nameCharacter.slice(0, 18) + "...";
    }

    const lastEpisodeUrl = character.episode.at(-1);
    const lastEpisodeName = await getEpisodeDataFromUrl(lastEpisodeUrl);

    const card = `
      <div class="card mb-3 card-character" onclick="viewCharacterDetail(${character.id})"> 
        <div class="row g-0">
          <div class="col-12 col-md-5">
            <div class="object-fit-fill border rounded h-100">
              <img src="${character.image}" class="w-100 h-100 rounded" alt="Foto do personagem ${character.name}">
            </div>
          </div>
          <div class="col-12 col-md-7">
            <div class="card-body fw-bolder">
              <h5 class="card-title">${nameCharacter}</h5>

              <p class="card-text">
                <small>
                  <i class="bi bi-circle-fill text-${mapStatus(character.status).color}"></i>
                  <span>${mapStatus(character.status).text} - ${mapSpecie(character.species)}</span>
                </small>
              </p>

              <p class="card-text">
                <small class="text-secondary">Última localização conhecida:</small><br>
                <small>${character.location.name}</small>
              </p>

              <p class="card-text">
                <small class="text-secondary">Visto a última vez em:</small><br>
                <small>${lastEpisodeName}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6");
    col.innerHTML = card;
    row.appendChild(col);
  }
}

function getPageNumber(url) {
  const params = new URLSearchParams(url.split("?")[1]);
  return params.get("page");
}

function renderPagination(prevPage, nextPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const ul = document.createElement("ul");
  ul.classList.add("pagination", "justify-content-center");

  const prevPageNumber = prevPage ? getPageNumber(prevPage) : null;
  const nextPageNumber = nextPage ? getPageNumber(nextPage) : null;

  // Botão anterior
  const liPrev = document.createElement("li");
  liPrev.classList.add("page-item", !prevPageNumber && "disabled");

  const btnPrev = document.createElement("button");
  btnPrev.classList.add("page-link");
  btnPrev.textContent = "Anterior";
  btnPrev.addEventListener("click", () => {
    if (prevPageNumber) loadMainContent(prevPageNumber);
  });

  liPrev.appendChild(btnPrev);
  ul.appendChild(liPrev);

  // Botão próximo
  const liNext = document.createElement("li");
  liNext.classList.add("page-item", !nextPageNumber && "disabled");

  const btnNext = document.createElement("button");
  btnNext.classList.add("page-link");
  btnNext.textContent = "Próximo";
  btnNext.addEventListener("click", () => {
    if (nextPageNumber) loadMainContent(nextPageNumber);
  });

  liNext.appendChild(btnNext);
  ul.appendChild(liNext);

  pagination.appendChild(ul);
}

function viewCharacterDetail(characterId) {
  window.location.href = `detail.html?character=${characterId}`;
}

function mapStatus(status) {
  const statuses = {
    "Alive": { text: "Vivo", color: "success" },
    "Dead": { text: "Morto", color: "danger" },
    "unknown": { text: "Desconhecido", color: "secondary" },
  };
  return statuses[status] || { text: "Desconhecido", color: "secondary" };
}

function mapSpecie(species) {
  return species || "Desconhecida";
}

async function getEpisodeDataFromUrl(url) {
  try {
    const episodeResponse = await axios.get(url);
    return episodeResponse.data.name; // Retorna o nome do episódio
  } catch (error) {
    console.error("Erro ao buscar dados do episódio:", error);
    return "Desconhecido";
  }
}
