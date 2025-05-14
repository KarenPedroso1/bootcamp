function mapStatus(status) {
  switch (status) {
    case "Alive":
      return { color: "success", text: "Vivo" };
    case "Dead":
      return { color: "danger", text: "Morto" };
    default:
      return { color: "secondary", text: "Desconhecido" };
  }
}

function mapSpecie(specie) {
  switch (specie) {
    case "Human":
      return "Humano";
    case "Alien":
      return "Alien";
    case "Robot":
      return "Robô";
    default:
      return `Outro (${specie})`;
  }
}

async function renderFooterData() {
  try {
    const [charactersRes, locationsRes, episodesRes] = await Promise.all([
      axios.get("https://rickandmortyapi.com/api/character"),
      axios.get("https://rickandmortyapi.com/api/location"),
      axios.get("https://rickandmortyapi.com/api/episode"),
    ]);

    document.getElementById("total-characters").innerText = charactersRes.data.info.count;
    document.getElementById("total-locations").innerText = locationsRes.data.info.count;
    document.getElementById("total-episodes").innerText = episodesRes.data.info.count;
  } catch (error) {
    console.error("Erro ao carregar dados do rodapé:", error);
  }

  // Nome e ano no rodapé
  document.getElementById("deve-name").innerText = "Karen Pedroso";
  document.getElementById("current-year").innerText = new Date().getFullYear();
}