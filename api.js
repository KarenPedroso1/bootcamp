
const api = axios.create({
    baseURL: "https://rickandmortyapi.com/api/",
});


// Buscar total de uma funcionalidade
async function listCharactersByPage(page = 1) {
    try {
        const result = await api.get("/character", {
            params: { page },
        });

        return {
            nextPage: result.data.info.next,
            prevPage: result.data.info.prev,
            charactersList: result.data.results,
        };
    } catch (error) {
        console.error(error);
    }
}

// Listagem dos personagens de acordo com os personagens
async function getEpisodeDataFromUrl(url) {
    try {
        const result = await axios.get(url); // Aqui usa axios direto, pois é URL completa
        return result.data.name;
    } catch (error) {
        console.error(error);
    }
}

// Buscar dados de um personagem por ID
async function getCharacterById(characterId) {
    try {
        const result = await api.get(`/character/${characterId}`);
        return result.data;
    } catch (error) {
        console.error(error);
    }
}
