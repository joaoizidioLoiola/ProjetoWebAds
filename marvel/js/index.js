const public_key = '506ed6f89fef4fafdfc895eec59c7f35';

let currentPlayer = 1;
let player1Count = 0;
let player2Count = 0;

let player1Characters = [];
let player2Characters = [];

async function fetchMarvelCharacters(query = '') {
  const url = query
    ? `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&limit=50&apikey=${public_key}`
    : `https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey=${public_key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error('Erro ao buscar personagens da Marvel:', error);
    return [];
  }
}

function createCharacterCard(character, onClick) {
  const card = document.createElement('div');
  card.classList.add('character-card');
  card.innerHTML = `
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
    <h3>${character.name}</h3>
  `;
  card.addEventListener('click', () => onClick(character));
  return card;
}

function displayCharacterList(characters) {
  const characterList = document.getElementById('character-list');
  characterList.innerHTML = '';

  characters.forEach(character => {
    const card = createCharacterCard(character, displayCharacterModal);
    characterList.appendChild(card);
  });
}

function displayCharacterModal(character) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.display = 'block';

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

  const closeButton = modal.querySelector('.close');
  closeButton.addEventListener('click', () => closeModal(modal));

  const selectButton = modal.querySelector('.select-character');
  selectButton.addEventListener('click', () => {
    addCharacterToHand(character);
    closeModal(modal);
  });
}

function closeModal(modal) {
  modal.style.display = 'none';
  document.body.removeChild(modal);
}

function addCharacterToHand(character) {
  if (currentPlayer === 1 && player1Count < 5) {
    addCharacter(character, player1Characters, 'player-hand');
    player1Count++;
    if (player1Count === 5) currentPlayer = 2;
  } else if (currentPlayer === 2 && player2Count < 5) {
    addCharacter(character, player2Characters, 'opponent-hand');
    player2Count++;
    if (player2Count === 5) currentPlayer = 1;
  }
}

function addCharacter(character, playerArray, handId) {
  const playerHand = document.getElementById(handId);
  const card = createCharacterCardForHand(character, playerArray, playerHand);
  playerHand.appendChild(card);
  playerArray.push(character);
}

function createCharacterCardForHand(character, playerArray, playerHand) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
    <h3>${character.name}</h3>
    <button class="remove-character">Remover</button>
  `;

  const removeButton = card.querySelector('.remove-character');
  removeButton.addEventListener('click', () => removeCharacter(character, playerArray, card, playerHand));

  return card;
}

function removeCharacter(character, playerArray, card, playerHand) {
  const index = playerArray.indexOf(character);
  if (index > -1) {
    playerArray.splice(index, 1);
    playerHand.removeChild(card);
    if (playerArray === player1Characters) {
      player1Count--;
    } else {
      player2Count--;
    }
  }
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

function calcularResultadoBatalha() {
  const battleResults = document.getElementById('battle-results');
  const numsP1 = gerarNums();
  const numsP2 = gerarNums();
  const resultado = compararNums(numsP1, numsP2);
  battleResults.innerHTML = resultado;
}

function gerarNums() {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 50));
}

function compararNums(numsP1, numsP2) {
  let player1Count = 0;
  let player2Count = 0;

  numsP1.forEach((num, i) => {
    if (num > numsP2[i]) {
      player1Count++;
    } else if (num < numsP2[i]) {
      player2Count++;
    }
  });

  if (player1Count > player2Count) {
    return 'Jogador 1 venceu a batalha';
  } else if (player1Count < player2Count) {
    return 'Jogador 2 venceu a batalha';
  } else {
    return 'A batalha terminou em empate!';
  }
}

document.getElementById('search-input').addEventListener('input', (event) => {
  const query = event.target.value;
  fetchMarvelCharacters(query).then(displayCharacterList);
});

fetchMarvelCharacters().then(displayCharacterList);

document.getElementById('clear-player1').addEventListener('click', () => {
  clearAllCharacters(player1Characters, document.getElementById('player-hand'));
});

document.getElementById('clear-player2').addEventListener('click', () => {
  clearAllCharacters(player2Characters, document.getElementById('opponent-hand'));
});

document.getElementById('calculate-result').addEventListener('click', calcularResultadoBatalha);
