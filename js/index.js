const public_key = "506ed6f89fef4fafdfc895eec59c7f35";

let currentPlayer = 1;
let player1Count = 0;
let player2Count = 0;

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

function displayCharacterModal(character) {
  // Cria e exibe o modal para o personagem selecionado
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.display = 'block';

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
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
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
      <h3>${character.name}</h3>
    `;
    playerHand.appendChild(card);
    player1Count++;
    if (player1Count === 5) currentPlayer = 2;
  } else if (currentPlayer === 2 && player2Count < 5) {
    const opponentHand = document.getElementById('opponent-hand');
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
      <h3>${character.name}</h3>
    `;
    opponentHand.appendChild(card);
    player2Count++;
    if (player2Count === 5) currentPlayer = 1;
  }
}

document.getElementById('search-input').addEventListener('input', (event) => {
  const query = event.target.value;
  fetchMarvelCharacters(query).then(characters => {
    displayCharacterList(characters);
  });
});

fetchMarvelCharacters().then(characters => {
  displayCharacterList(characters);
});