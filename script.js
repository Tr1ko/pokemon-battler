//connecting to the pokemon API
async function getPokemon(name) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if(!res.ok){
        throw new Error("Pokemon not found")
    }

    const data = await res.json()
    console.log(data)
    return data;

}


//Load the first pokemon

async function loadPokemon(inputId, containerId) {
    const name = document.getElementById(inputId).value.toLowerCase();
    const data = await getPokemon(name);
    const container = document.getElementById(containerId);
    const image = data.sprites.front_default || "https://via.placeholder.com/100?text=No+Image"
    container.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${image}" alt="${data.name}" />
        <p>HP: ${data.stats[0].base_stat}</p>
        <p>Attack: ${data.stats[1].base_stat}</p>
        <p>Defense: ${data.stats[2].base_stat}</p>
        `;  
    window[containerId] = data;
}

function battle() {
    const poke1 = window.pokemon1;
    const poke2 = window.pokemon2;

    if(!poke1 || !poke2) {
        alert("please load both Pokemon before battling")
        return;
    }

    const atk1 = poke1.stats[1].base_stat;
    const atk2 = poke2.stats[1].base_stat;

    const type1 = poke1.types[0].type.name;
    const type2 = poke2.types[0].type.name;

    const eff1 = getEffectiveness(type1, type2);
    const eff2 = getEffectiveness(type2, type1);

    const finalAtk1 = atk1 * eff1;
    const finalAtk2 = atk2 * eff2;
    
    let winner, message1, message2;

    message1 = eff1 > 1 ? "Super effective!" : eff1 < 1 ? "Not very effective..." : "Normal attack";
    message2 = eff2 > 1 ? "Super effective!" : eff2 < 1 ? "Not very effective..." : "Normal attack";

    winner = finalAtk1 > finalAtk2 ? poke1.name : poke2.name;

    alert(`
        ${poke1.name} attacks ${poke2.name}: ${message1}
        ${poke2.name} attacks ${poke1.name}: ${message2}
        Winner: ${winner.toUpperCase()}!
    `);
}

const typeEffectiveness = {
  fire: { strongAgainst: ['grass', 'bug', 'ice'], weakAgainst: ['water', 'rock', 'fire'] },
  water: { strongAgainst: ['fire', 'rock', 'ground'], weakAgainst: ['electric', 'grass', 'water'] },
  grass: { strongAgainst: ['water', 'rock', 'ground'], weakAgainst: ['fire', 'bug', 'poison'] },
  electric: { strongAgainst: ['water'], weakAgainst: ['ground', 'electric'] }
};

function getEffectiveness(attackerType, defenderType){
    if(typeEffectiveness[attackerType]?.strongAgainst.includes(defenderType)){
        return 2; // super effective
    } else if(typeEffectiveness[attackerType]?.weakAgainst.includes(defenderType)){
        return 0.5; // not very effective
    } else {
        return 1; // normal
    }
}




