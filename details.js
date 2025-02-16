const baseName = "https://pokeapi.co/api/v2/pokemon/";
const baseSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
let pokeId = null;
const num = 151;

document.addEventListener("DOMContentLoaded", () => {
    const pId = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pId, 10);

    if (isNaN(id) || id < 1 || id > num) {
        return window.location.href = "./pokedex.html";
    }
    pokeId = id;
    loadPokemonId(id);
});

const loadPokemonId = async (id) => {
    try {
        const resp = await fetch(`${baseName}${id}`);
        const pokemon = await resp.json();
        const respo = await fetch(`${baseSpecies}${id}`);
        const pokeSpecies = await respo.json();

        if (pokeId === id) {
            displayPokemonDetails(pokemon);
            document.querySelector(".pokeDiscription").textContent = getDesignedText(pokeSpecies);
            setNavigationButtons(id);
            window.history.pushState({}, "", `./detail.html?id=${id}`);
            localStorage.setItem("lastPokemonId", id);
        }
    } catch (e) {
        console.error("Couldn't fetch this Pokémon's data!!!", e);
    }
};

const setNavigationButtons = (id) => {
    const leftArrow=document.querySelector(".left");
    const rightArrow=document.querySelector(".right");
        
    // leftArrow.removeEventListener("click", navigatePokemon);
    // rightArrow.removeEventListener("click", navigatePokemon);

    if (id > 1) {
        leftArrow.addEventListener("click", navigatePokemonLeft);
    }
    if (id < num) {
        rightArrow.addEventListener("click", navigatePokemonRight);
    }   
};

const navigatePokemonLeft = async () => {
    pokeId--;
    await loadPokemonId(pokeId);
};
const navigatePokemonRight = async () => {
    pokeId++;
    await loadPokemonId(pokeId);
};

const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC"
};

const setTypeBackgroundColor = (pokemon) => {
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];
    
    if (!color) return;
    
    const container = document.querySelector(".container");
    container.style.backgroundColor = color;
    container.style.borderColor = color;

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .statsBox .progressBar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.4);
        }
        .statsBox .progressBar::-webkit-progress-value {
            background-color: ${color};
        }
    `;
    document.head.appendChild(styleTag);

    // document.querySelectorAll(".type> p").forEach(el => el.style.backgroundColor = typeColors[el.className]);
    document.querySelectorAll(".statsBox p.stats, .statsBox .progressBar").forEach(el => el.style.color = color);
};

function rgbaFromHex(hexColor) {
    return [
      parseInt(hexColor.slice(1, 3), 16),
      parseInt(hexColor.slice(3, 5), 16),
      parseInt(hexColor.slice(5, 7), 16),
    ].join(", ");
}

const displayPokemonDetails = (pokemon) => {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalizePokemonName = name.charAt(0).toUpperCase() + name.slice(1);
    
    
    document.querySelector(".name").textContent = capitalizePokemonName;
    document.querySelector(".id").textContent = `#${String(id).padStart(3, "0")}`;
    document.querySelector(".image img").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    
    const typeWrapper = document.querySelector(".type");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        const typeEl = document.createElement("p");
        typeEl.className = type.name;
        typeEl.textContent = type.name;
        typeEl.style.backgroundColor=`${typeColors[type.name]}`; 
        typeWrapper.appendChild(typeEl);
    });

    document.querySelector(".weight").textContent = `${weight / 10}kg`;
    document.querySelector(".height").textContent = `${height / 10}m`;

    const abilitiesWrapper = document.querySelector(".pokeDetail.move");
    abilitiesWrapper.innerHTML = abilities.length > 0 ? abilities.map(a => `<p>${a.ability.name}</p>`).join('') : "<p>No moves available</p>";

    const statsWrapper = document.querySelector(".stats");
    statsWrapper.innerHTML = stats.map(({ stat, base_stat }) => `
        <div class="statsBox">
            <p class="stat">${stat.name.toUpperCase()}</p>
            <p class="statValue">${String(base_stat).padStart(3, "0")}</p>
            <progress class="progressBar" value="${base_stat}" max="100"></progress>
        </div>
    `).join('');
    
    document.querySelectorAll(".statsBox .stat").forEach(statBox => {
        switch (statBox.textContent.trim().toUpperCase()) { 
            case "HP":
                statBox.textContent = "HP";
                break;
            case "ATTACK":
                statBox.textContent = "ATK";
                break;
            case "DEFENSE":
                statBox.textContent = "DEF";
                break;
            case "SPECIAL-ATTACK":
                statBox.textContent = "Sp. ATK";
                break;
            case "SPECIAL-DEFENSE":
                statBox.textContent = "Sp. DEF";
                break;
            case "SPEED":
                statBox.textContent = "SPD";
                break;
            default:
                break;
        }
    });
    

    setTypeBackgroundColor(pokemon);
};

const getDesignedText = (pokemonSpecies) => {
    const entry = pokemonSpecies.flavor_text_entries.find(e => e.language.name === "en");
    return entry ? entry.flavor_text.replace(/\f/g, " ") : "";
};


