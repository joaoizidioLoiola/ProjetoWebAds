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

function displayCharacterModal(characters) {
  const modalContainer = document.getElementById('modal-container');

  characters.forEach(character => {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Conteúdo do modal
    modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" />
      <div>
        <h3>${character.name}</h3>
        <p>${character.description || 'Sem descrição disponível.'}</p>
        <button class="select-character">Selecionar</button>
      </div>
    </div>
  `;

    modalContainer.appendChild(modal);

    // Botão para fechar o modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Botão para selecionar o personagem
    const selectButton = modal.querySelector('.select-character');
    selectButton.addEventListener('click', () => {
      console.log(`Personagem ${character.name} selecionado`);
      modal.style.display = 'none';
      addCharacterToHand(character);
    });

    // Mostrar o modal
    modal.style.display = 'block';
  });
}

function addCharacterToHand(character) {
  const playerHand = document.getElementById('player-hand');
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('draggable', true);
  card.innerHTML = `
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" />
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
  displayCharacterModal(characters);
});