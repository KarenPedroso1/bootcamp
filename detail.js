document.addEventListener("DOMContentLoaded", main);
document
  .getElementById("btn-return")
  .addEventListener("click", returnToMainPage);

async function main() {
  const params = new URLSearchParams(window.location.search);
  const characterId = params.get("character");

  if (!characterId) {
    window.location.href = "index.html";
    return;
  }

  const character = await getCharacterById(characterId);
  console.log(character);

  loadMainContent(characterId);
  renderFooterData();
}

async function loadMainContent(characterId) {
  const character = await getCharacterById(characterId);

  // Garante que há episódios disponíveis
  if (!character.episode || character.episode.length === 0) return;

  const lastEpisodeUrl = character.episode[character.episode.length - 1];
  const episodeName = await getEpisodeDataFromUrl(lastEpisodeUrl);

  character.episode = {
    url: lastEpisodeUrl,
    name: episodeName,
  };

  renderCardCharacter(character, episodeName);
}

function renderCardCharacter(character, lastEpisodeName) {
  const row = document.getElementById("character-detail");
  row.innerHTML = "";

  const card = `
    <div class="card shadow mb-3 card"> 
      <div class="row g-0">
        <div class="col-12 col-md-5">
          <div class="object-fit-fill border rounded h-100">
            <img src="${character.image}" class="w-100 h-100 rounded" alt="Foto do ${character.name}">
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="card-body fw-bolder">
            <h5 class="card-title">${character.name}</h5>

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
  col.classList.add("col-12");
  col.innerHTML = card;

  row.appendChild(col);
}

function returnToMainPage() {
  window.location.href = "index.html";
}