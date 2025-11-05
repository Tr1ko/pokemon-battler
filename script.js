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
    
    if (containerId === "pokemon1") {
        document.getElementById("hp-bar-container-1").style.display = 'block';
    } else if (containerId === "pokemon2") {
        document.getElementById("hp-bar-container-2").style.display = 'block';
    }
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

    message1 = eff1 > 1 ? "Super effective!" : eff1 < 1 ? "Not very effective..." : "Normal attack";
    message2 = eff2 > 1 ? "Super effective!" : eff2 < 1 ? "Not very effective..." : "Normal attack";

    document.getElementById('msg1').textContent = `${poke1.name} attacks ${poke2.name}: ${message1}`;
    document.getElementById('msg2').textContent = `${poke2.name} attacks ${poke1.name}: ${message2}`;

    // Determine winner
    let winner;
    if(finalAtk1 > finalAtk2) winner = poke1.name;
    else if(finalAtk2 > finalAtk1) winner = poke2.name;
    else winner = "It's a tie";

    // Print winner on page instead of alert
    showWinner(`Winner: ${winner.toUpperCase()}!`);
}

function resetBattler() {
    // Clear input fields
    document.getElementById('poke1').value = "";
    document.getElementById('poke2').value = "";

    // Clear Pokémon display areas
    document.getElementById('pokemon1').innerHTML = "";
    document.getElementById('pokemon2').innerHTML = "";

    // Clear message areas
    document.getElementById('msg1').textContent = "";
    document.getElementById('msg2').textContent = "";

    // Hide HP bars
    document.getElementById('hp-bar-container-1').style.display = 'none';
    document.getElementById('hp-bar-container-2').style.display = 'none';

    // Clear winner message
    document.getElementById('winnerMessage').textContent = "";

    // Remove loaded data from memory
    window.pokemon1 = undefined;
    window.pokemon2 = undefined;
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

function showWinner(winnerText) {
  const winnerDiv = document.getElementById('winnerMessage');
  winnerDiv.classList.remove('winner');
  void winnerDiv.offsetWidth;
  winnerDiv.textContent = winnerText;
  winnerDiv.classList.add('winner');

  // Fire confetti!
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}



