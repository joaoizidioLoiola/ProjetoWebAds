document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    const editModal = document.getElementById('edit-modal');
    const editTaskInput = document.getElementById('edit-task-input');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const closeBtn = document.querySelector('.close-btn');

    let tasks = [];
    let localTaskId = 201; // ID inicial para tarefas criadas localmente
    let currentEditId = null; // ID da tarefa que está sendo editada
    const public_key = '506ed6f89fef4fafdfc895eec59c7f35'
    const private_key = 'f4cb12401e8ec6a2d8270f11cbe3a83dcac6591c';

    base_url = "https://gateway.marvel.com";
    const marv = [];
    const fetchMarvel = async () => {
        try {
            const url = (`${base_url}/v1/public/characters?apikey=${public_key}`)
            const res = await fetch(url, { mode: 'no-cors' })
            const da = await response.json()
            marv = da;
            console.log(marv);

        } catch (error) {

            console.log('erro:', error)
        }
    }

    // Função para buscar tarefas da API
    const fetchTasks = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            const data = await response.json();
            tasks = data;
            renderTasks();
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    };

    // Função para renderizar tarefas
    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${task.title}</span>
                <div class="btts">
                    <button class="bt-add" onclick="openEditModal(${task.id})">Editar</button>
                    <button class="bt-delete" onclick="deleteTask(${task.id})">Deletar</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    // Função para adicionar uma nova tarefa
    const addTask = async (title) => {
        const newTask = {
            id: localTaskId++, // Incrementa o ID local para cada nova tarefa criada
            title,
            completed: false
        };
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
            tasks.push(newTask); // Adiciona diretamente a nova tarefa criada localmente
            renderTasks();
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    };

    // Função para abrir o modal de edição
    window.openEditModal = (id) => {
        currentEditId = id;
        const task = tasks.find(task => task.id === id);
        if (task) {
            editTaskInput.value = task.title;
            editModal.style.display = 'block';
        }
    };

    // Função para fechar o modal
    const closeModal = () => {
        editModal.style.display = 'none';
        currentEditId = null;
    };

    // Função para salvar a edição de uma tarefa
    const saveEdit = async () => {
        const newTitle = editTaskInput.value.trim();
        if (!newTitle) return;

        const taskIndex = tasks.findIndex(task => task.id === currentEditId);
        if (taskIndex === -1) return;

        const task = tasks[taskIndex];

        if (task.id < 201) { // Verifica se a tarefa é da API (IDs da API são <= 200)
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newTitle })
                });

                if (response.ok) { // Verifica se a resposta é 2xx
                    const updatedTask = { ...task, title: newTitle };
                    tasks[taskIndex] = updatedTask;
                    renderTasks();
                } else {
                    console.error('Erro ao editar tarefa:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Erro ao editar tarefa:', error);
            }
        } else {
            // Atualiza a tarefa criada localmente
            task.title = newTitle;
            tasks[taskIndex] = task;
            renderTasks();
        }

        closeModal();
    };

    // Função para deletar uma tarefa
    window.deleteTask = async (id) => {
        try {
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE'
            });
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    };

    // Evento de submit do formulário para adicionar tarefa
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskTitle = taskInput.value.trim();
        if (taskTitle) {
            addTask(taskTitle);
            taskInput.value = '';
        }
    });

    // Evento para salvar a edição
    saveEditBtn.addEventListener('click', saveEdit);

    // Evento para cancelar a edição
    cancelEditBtn.addEventListener('click', closeModal);

    // Evento para fechar o modal ao clicar no "x"
    closeBtn.addEventListener('click', closeModal);

    // Evento para fechar o modal ao clicar fora do conteúdo do modal
    window.addEventListener('click', (e) => {
        if (e.target == editModal) {
            closeModal();
        }
    });

    fetchMarvel();

    // Buscar e renderizar tarefas ao carregar a página
    fetchTasks();
});
