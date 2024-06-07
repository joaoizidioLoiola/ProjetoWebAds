document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskListContainer = document.getElementById('task-list-container');

    const editModal = document.getElementById('edit-modal');
    const editTaskInput = document.getElementById('edit-task-input');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const closeBtn = document.querySelector('.close-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let localTaskId = localStorage.getItem('localTaskId') ? parseInt(localStorage.getItem('localTaskId')) : 201; // ID inicial para tarefas criadas localmente
    let currentEditId = null; // ID da tarefa que está sendo editada

    // Função para buscar tarefas da API
    const fetchTasks = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            const data = await response.json();
            const apiTasks = data.slice(0, 5).map(task => ({ ...task, isLocal: false })); // Limita a 5 tarefas
            tasks = [...apiTasks, ...tasks.filter(task => task.isLocal)]; // Combina tarefas da API e locais
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    };

    // Função para renderizar tarefas
    const renderTasks = () => {
        taskListContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';
            taskDiv.innerHTML = `
                <span>${task.title}</span>
                <div class="task-actions">
                    <button class="bt-edit" onclick="openEditModal(${task.id}, ${task.isLocal})">Editar</button>
                    <button class="bt-delete" onclick="deleteTask(${task.id}, ${task.isLocal})">Deletar</button>
                </div>
            `;
            taskListContainer.appendChild(taskDiv);
        });
    };

    // Função para adicionar uma nova tarefa
    const addTask = (title) => {
        const newTask = {
            id: localTaskId++, // Incrementa o ID local para cada nova tarefa criada
            title,
            completed: false,
            isLocal: true
        };
        tasks.unshift(newTask); // Adiciona a nova tarefa ao início da lista
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('localTaskId', localTaskId.toString());
        renderTasks();
    };

    // Função para abrir o modal de edição
    window.openEditModal = (id, isLocal) => {
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
        task.title = newTitle;
        if (!task.isLocal) {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newTitle })
                });
                if (!response.ok) {
                    console.error('Erro ao editar tarefa:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Erro ao editar tarefa:', error);
            }
        }
        tasks[taskIndex] = task;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        closeModal();
    };

    // Função para deletar uma tarefa
    window.deleteTask = async (id, isLocal) => {
        if (!isLocal) {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    console.error('Erro ao deletar tarefa:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Erro ao deletar tarefa:', error);
            }
        }
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
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

    // Buscar e renderizar tarefas ao carregar a página
    fetchTasks();
    renderTasks();
});
