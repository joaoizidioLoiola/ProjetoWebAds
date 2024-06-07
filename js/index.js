// Função para buscar personagens da Marvel
async function fetchMarvelCharacters() {
  var pOff = (page - 1) * 100;
  try {
    const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?limit=100&offset=${pOff}&apikey=${public_key}`);
    const data = await response.json();
    const characters = data.data.results;
    return characters;
  } catch (error) {
    console.error('Erro ao buscar personagens da Marvel:', error);
    return [];
  }
}

// Função para exibir modais dos personagens
function displayCharacterModal(characters) {
  const modalContainer = document.getElementById('modal-container');

  characters.forEach(character => {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Conteúdo do modal
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>${character.name}</h3>
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" />
        <p>${character.description}</p>
        <button class="select-character">Selecionar</button>
      </div>
    `;

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

    // Adicionar modal ao contêiner
    modalContainer.appendChild(modal);
  });
}

// Exibir modais dos personagens
fetchMarvelCharacters().then(characters => {
  displayCharacterModal(characters);
});
