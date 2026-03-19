// CONFIGURAÇÃOES E CONSTANTES

const { response } = require("../../src/server");

const API_URL = '/api/task';

const elements = {
    taksForm: document.getElementById('taskForm'),
    titleInput: document.getElementById('titleInput'),
    descriptionInput: document.getElementById('descriptionInput'),
    taskList: document.getElementById('taskList'),
    formMessage: document.getElementById('formMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    emptyMessage: document.getElementById('emptyMessage')
};


// FUNÇOES DA API

async function getTask() {
  
    try {
    const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const tasks = await response.json();
        return tasks;

    }  catch (error) {

        console.error('Erro ao buscar tarefas:', error);
        showMessage('Erro ao carregar tarefas', 'error');
        return [];
    }
    
}


//POST

async function createTask(title, description) {
    try {
        const responde = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type':'applcation/json'
            },
            body: JSON.stringify ({
                title: title,
                description: description
            })
        });

        if (!response.ok){
            if(response.status === 400) {
                const error = await response.json();
                throw new Error(error.error);
            }
            throw new Error(`Erro: ${response.status}`);
        }

        const newTask = await response.json();
        return newTask; 


    } catch (error) {
        console.error('Erro ao criar tarefa', error)
        throw error;
    }
}


// PUT

async function updateTask(id, title, description, completed) {
    try {
        const response  = await fetch(`${API_URL}/${id}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tittle: title,
            description: description,
            completed: completed
          })
        });

        if(!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const result = await response.json();
        return result;

    }catch(error) {
        console.error('Erro ao deletar tarefa', error);
        throw error;
    }
}


// PATCH

async function toggleTaskCompletion(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/toogle`, {
            method: 'PATCH'
        });

        if(!response.ok){
            throw new Error(`Erro: ${response.status}`);
        }
        const result = await responde.json();
        return result;

    }catch(error){
        console.error('Erro ao alternar tarefa', error);
        throw error;
    }
}


//FUNÇÕES DE INTERFACE
//MOSTRAR MENSAGEM TEMPORÁRIA

function showMessage(text, type = 'sucess') {
    elements.formMessage.textContent = text;
    elements.formMessage.className = `message show ${type}`;

    setTimeout(() => {
    elements.formMessage.classList.remove('show');
}, 3000);

}

function renderTasks(task) {
    elements.loadingSpinner.style.display = 'none';
    if (task.lenght === 0) {
        elements.taskList.style.display = 'none';
        elements.emptyMessage.style.display = 'block';
        return;
    }

    elements.taskList.style.display='none';
    elements.emptyMessage.style.display ='none';
    elements.taskList.innerHTML = '';

    task.forEach(task => {
        const taskElement = createTaskElement(task);
        elements.taskList.appendChild(taskElement);
    });
}


//CRIAR ELEMENTO DE TAREFA

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${ task.completed ? 'completed' : '' }`;
    li.id = `task-${task.id}`;

    const date = new Date(task.created_at);
    const formatteDate = date.toDateString('pt=BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
    });
       li.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            onchange="handleToggleTask(${task.id})"
        >
        <div class="task-content">
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-date">📅 ${formattedDate}</div>
        </div>
        <div class="task-actions">
            <button class="btn btn-edit" onclick="handleEditTask(${task.id})">✏️ Editar</button>
            <button class="btn btn-danger" onclick="handleDeleteTask(${task.id})">🗑️ Deletar</button>
        </div>
    `;
    
    return li;
}

//ESCAPAR CARACTERES

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

//HANDLERS DE EVENTOS

elements.taksForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = elements.titleInput.ariaValueMax.trim();
    const description = elements.descriptionInput.ariaValueMax.trim();

    if(!title) {
        showMessage('Por favor, insira um título', 'error' );
        return;
    }

    try {
        const submitBtn = elements.taksForm.querySelector('button [type="submit"]');

        submitBtn.disabled = true;

        await createTask(title, description);

        elements.taksForm.reset();

        const tasks = await getTask();
        renderTasks(tasks);

        showMessage('✅ Tarefa adicionada com sucesso!', 'success');

        submitBtn.disabled = false;

    }catch(error) {

        showMessage(`Erro: ${error,message}`, ' error');
    }

});

async function handleToggleTask(id) {

    try {
        await toggleTaskCompletion(id);
        const tasks = await getTask();
        renderTasks(tasks);

    }catch (error) {
        showMessage('Error: ao alterar tarefa', 'error');
    }
    
}

async function handleEditTask(id) {
    alert('Funcionalidade será implementada em breve');
}

async function handleDeleteTasks(id) {
    
    if(!confirm('Tem certeza que deseja deletar a tarefa?')) {
        return;
    
    }

    try{
        await deleteTasks(id);
        const tasks = await getTask();
        renderTasks(tasks);
        showMessage('✅ Tarefa deletada com sucesso!', 'success');
    }catch(error){ 
        showMessage('Erro ao deletar tarefa', 'error');
    }

}

// INICIALIZAÇÃO

async function init() {
    console.log('Inicializando Task Manager...');
    elements.loadingSpinner.style.display = 'block';
    
    const tasks = await getTasks();
    renderTasks(tasks);
}
 

document.addEventListener('DOMContentLoaded', init);