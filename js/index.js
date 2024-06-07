const public_key = '506ed6f89fef4fafdfc895eec59c7f35';
const private_key = 'f4cb12401e8ec6a2d8270f11cbe3a83dcac6591c';


async function fetchMarvelCharacters() {
  try {
    const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey=${public_key}`);
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
  const playerHand = document.getElementById('player-hand');
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('draggable', true);
  card.innerHTML = `
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
    <h3>${character.name}</h3>
  `;
  card.addEventListener('dragstart', drag);

  playerHand.appendChild(card);
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const card = document.getElementById(data);
  event.target.appendChild(card);
}

// Configurar áreas de drop
document.querySelectorAll('.card-hand').forEach(hand => {
  hand.addEventListener('dragover', allowDrop);
  hand.addEventListener('drop', drop);
});

fetchMarvelCharacters().then(characters => {
  displayCharacterList(characters);
});