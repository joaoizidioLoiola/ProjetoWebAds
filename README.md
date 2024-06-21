# Projeto Web Ads

Este repositório contém duas aplicações web principais: um Gerenciador de Notas e um Jogo de Batalha de Cartas da Marvel. Cada aplicação tem funcionalidades distintas, usando diferentes APIs e recursos do DOM.

## Índice

- [Gerenciador de Notas](#gerenciador-de-notas)
  - [Funcionalidades](#funcionalidades-gerenciador)
  - [Instruções](#instruções-gerenciador)
- [Batalha de Cartas da Marvel](#batalha-de-cartas-da-marvel)
  - [Funcionalidades](#funcionalidades-marvel)
  - [Instruções](#instruções-marvel)
- [Landing Page](#landing-page)

## Gerenciador de Notas

### Funcionalidades <a name="funcionalidades-gerenciador"></a>

- Criar novas notas.
- Editar notas existentes.
- Excluir notas.
- Buscar notas específicas da API JSONPlaceholder.

### Instruções <a name="instruções-gerenciador"></a>

1. Abra a página `https://joaoizidioloiola.github.io/ProjetoWebAds/notes/` no navegador.
2. Adicione novas tarefas utilizando o formulário.
3. Edite ou exclua tarefas utilizando os botões correspondentes em cada tarefa.
4. A aplicação busca algumas notas da API JSONPlaceholder e as combina com as notas locais.

#### Estrutura de Arquivos

- `notes/index.html`: HTML principal da aplicação de notas.
- `notes/css/style.css`: Estilos específicos para a aplicação de notas.
- `notes/js/main.js`: Script JavaScript para a aplicação de notas.

## Batalha de Cartas da Marvel

### Funcionalidades <a name="funcionalidades-marvel"></a>

- Buscar heróis da Marvel por nome usando a API da Marvel.
- Visualizar detalhes de um herói em um modal.
- Selecionar até 5 heróis para cada jogador (são dois jogadores no total).
- Remover heróis selecionados.
- Realizar uma simples batalha entre os heróis selecionados pelos dois jogadores.

### Instruções <a name="instruções-marvel"></a>

1. Abra a página `https://joaoizidioloiola.github.io/ProjetoWebAds/marvel/` no navegador.
2. Use o campo de busca para encontrar heróis da Marvel.
3. Clique em um herói para visualizar detalhes e selecionar para um dos jogadores.
4. Após selecionar 5 heróis para cada jogador, clique no botão para realizar a batalha e ver o resultado.

#### Estrutura de Arquivos

- `marvel/index.html`: HTML principal da aplicação de batalha de cartas da Marvel.
- `marvel/css/style.css`: Estilos específicos para a aplicação de batalha de cartas da Marvel.
- `marvel/js/marvel.js`: Script JavaScript para a aplicação de batalha de cartas da Marvel.

## Landing Page <a name="landing-page"></a>

### Descrição

A landing page é a página inicial que fornece uma visão geral das duas aplicações (Gerenciador de Notas e Batalha de Cartas da Marvel) e direciona para cada uma delas.
