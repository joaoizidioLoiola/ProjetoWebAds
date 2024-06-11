const public_key = '506ed6f89fef4fafdfc895eec59c7f35';

let currentPlayer = 1;
let player1Count = 0;
let player2Count = 0;

let player1Characters = [];
let player2Characters = [];

async function fetchMarvelCharacters(query = '') {
  const url = query
    ? `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&limit=100&apikey=${public_key}`
    : `https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey=${public_key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const characters = data.data.results;
    return characters;
  } catch (error) {
    console.error('Erro ao buscar personagens da Marvel:', error);
    return [];
  }
}

function displayCharacterList(characters) {
  const characterList = document.getElementById('character-list');
  characterList.innerHTML = ''; // Clear previous characters

  characters.forEach(character => {
    const card = document.createElement('div');
    card.classList.add('character-card');

    // Conteúdo da carta
    card.innerHTML = `
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
      <h3>${character.name}</h3>
    `;

    card.addEventListener('click', () => {
      displayCharacterModal(character);
    });

    characterList.appendChild(card);
  });
}

// Cria e exibe o modal para o personagem selecionado
function displayCharacterModal(character) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.display = 'block ';

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img class="imgModal" src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
      <div>
        <h3>${character.name}</h3>
        <p>${character.description || 'Sem descrição disponível.'}</p>
        <button class="select-character">Selecionar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Botão para fechar o modal
  const closeButton = modal.querySelector('.close');
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.removeChild(modal);
  });

  // Botão para selecionar o personagem
  const selectButton = modal.querySelector('.select-character');
  selectButton.addEventListener('click', () => {
    console.log(`Personagem ${character.name} selecionado`);
    modal.style.display = 'none';
    document.body.removeChild(modal);
    addCharacterToHand(character);
  });
}

function addCharacterToHand(character) {
  if (currentPlayer === 1 && player1Count < 5) {
    const playerHand = document.getElementById('player-hand');
    const card = createCharacterCard(character, player1Characters, playerHand);
    playerHand.appendChild(card);
    player1Characters.push(character);
    player1Count++;
    if (player1Count === 5) currentPlayer = 2;
  } else if (currentPlayer === 2 && player2Count < 5) {
    const opponentHand = document.getElementById('opponent-hand');
    const card = createCharacterCard(character, player2Characters, opponentHand);
    opponentHand.appendChild(card);
    player2Characters.push(character);
    player2Count++;
    if (player2Count === 5) currentPlayer = 1;
  }
}

function createCharacterCard(character, playerArray, playerHand) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
    <h3>${character.name}</h3>
    <button class="remove-character">Remover</button>
  `;

  // Botão para remover o personagem
  const removeButton = card.querySelector('.remove-character');
  removeButton.addEventListener('click', () => {
    playerArray.splice(playerArray.indexOf(character), 1);
    playerHand.removeChild(card);
    if (playerArray === player1Characters) {
      player1Count--;
    } else {
      player2Count--;
    }
  });

  return card;
}

function clearAllCharacters(playerArray, playerHand) {
  playerArray.length = 0;
  playerHand.innerHTML = '';
  if (playerArray === player1Characters) {
    player1Count = 0;
  } else {
    player2Count = 0;
  }
}

// Aqui você pode implementar a lógica para calcular os resultados da batalha
// e exibir no elemento `battle-results`
function calcularResultadoBatalha() {
  const battleResults = document.getElementById('battle-results');
  function gerarNums() {
    let nums = [];
    for (let i = 0; i < 5; i++) {
      nums.push(Math.floor(Math.random() * 50));
    }
    return nums;
  }

  function compararNums(numsP1, numsP2) {
    let player1Count = 0;
    let player2Count = 0;

    for (let i = 0; i < 5; i++) {
      if (numsP1[i] > numsP2[i]) {
        player1Count++;
      } else if (numsP1[i] < numsP2[i]) {
        player2Count++;
      }
    }

    if (player1Count > player2Count) {
      return battleResults.innerHTML = `Jogador 1 venceu a batalha`;
    } else if (player2Count < player2Count) {
      return battleResults.innerHTML = `Jogador 2 venceu a batalha`;
    } else {
      return "A batalha terminou em empate!";
    }
  };

  let var1 = gerarNums();
  let var2 = gerarNums();
  // battleResults.innerHTML = `Jogador 1 tem ${player1Characters.length} personagens. Jogador 2 tem ${player2Characters.length} personagens.`;
}
console.log(compararNums(var1, var2));

document.getElementById('search-input').addEventListener('input', (event) => {
  const query = event.target.value;
  fetchMarvelCharacters(query).then(characters => {
    displayCharacterList(characters);
  });
});

fetchMarvelCharacters().then(characters => {
  displayCharacterList(characters);
});

document.getElementById('clear-player1').addEventListener('click', () => {
  clearAllCharacters(player1Characters, document.getElementById('player-hand'));
});

document.getElementById('clear-player2').addEventListener('click', () => {
  clearAllCharacters(player2Characters, document.getElementById('opponent-hand'));
});

document.getElementById('calculate-result').addEventListener('click', calcularResultadoBatalha);
