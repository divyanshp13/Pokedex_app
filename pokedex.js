const baseName = "https://pokeapi.co/api/v2/pokemon/";
const baseSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
const num = 151;
const searchBar = document.querySelector(".searchBar");
const pokeList = document.querySelector(".pokeList");
const cross = document.querySelector(".cross");
const notFound = document.querySelector(".notFound");
const pokeImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${num}`)
    .then(res => res.json())
    .then(data => {
        allPokemons = data.results;
        displayPokemons(allPokemons);
    })
    .catch(e => console.error("Could not fetch all Pokémon:", e));

const fetchData = async (id) => {
    try {
        const resp = await fetch(baseName + id);
        const pokemon = await resp.json();
        const respo = await fetch(baseSpecies + id);
        const pokeSpecies = await respo.json();
        return true;
    } catch (e) {
        console.error("Could not fetch this Pokémon's data:", e);
        return false;
    }
};

const displayPokemons = (pokemons) => {
    pokeList.innerHTML = "";

    if (pokemons.length === 0) {
        notFound.style.display = "block";
    } else {
        notFound.style.display = "none";
        pokemons.forEach(pokemon => {
            const url = pokemon.url;
            const pokeId = url.split("/")[6];

            let listItem = document.createElement("div");
            listItem.className = "listItem";
            listItem.innerHTML = `
                <div class="idNumber">#${pokeId.padStart(3, "0")}</div>
                <div class="pokeSection">
                    <img src="${pokeImage}${pokeId}.svg" alt="${pokemon.name}" class="pokemon">
                </div>
                <div class="name">${pokemon.name}</div>
            `;

            // Attach click event for navigation
            listItem.addEventListener("click", async () => {
                const allData = await fetchData(pokeId);
                if (allData) {
                    window.location.href = `./details.html?id=${pokeId}`;
                }
            });

            pokeList.appendChild(listItem);
        });
    }
};

searchBar.addEventListener("keyup", () => {
    const query = searchBar.value.toLowerCase().trim();
    const searchedPokemon = allPokemons.filter(pokemon => pokemon.name.includes(query));

    displayPokemons(searchedPokemon);
});

cross.addEventListener("click", () => {
    searchBar.value = "";
    displayPokemons(allPokemons);
});
