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

  characters.forEach(characters => {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Conteúdo do modal
    modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>${characters.name}</h3>
      <img src="${characters.thumbnail.path}.${characters.thumbnail.extension}" alt="${characters.name}" />
      <p>${characters.description}</p>
      <button class="select-character">Selecionar</button>
    </div>
  `;

    modalContainer.appendChild(modal);
  });
}

// Botão para fechar o modal
const closeButton = modal.querySelector('.close');
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Botão para selecionar o personagem
const selectButton = modal.querySelector('.select-character');
selectButton.addEventListener('click', () => {
  // Aqui você pode adicionar a lógica para selecionar o personagem e adicionar à mão do jogador
  console.log(`Personagem ${character.name} selecionado`);
  modal.style.display = 'none';
});

// Adicionar modal ao documento
document.getElementById('hero-modals').appendChild(modal);

// Exibir modais dos personagens
fetchMarvelCharacters().then(characters => {
  displayCharacterModal(characters);
});
