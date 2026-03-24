// CONFIGURAÇÕES E CONSTANTES

const API_URL = '/api/tasks';

const elements = {
  taskForm: document.getElementById('taskForm'),
  titleInput: document.getElementById('titleInput'),
  descriptionInput: document.getElementById('descriptionInput'),
  taskList: document.getElementById('taskList'),
  formMessage: document.getElementById('formMessage'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  emptyMessage: document.getElementById('emptyMessage')
};

// FUNÇÕES DA API

async function getTask() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    showMessage('Erro ao carregar tarefas', 'error');
    return [];
  }
}

async function createTask(title, description) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      description
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Erro: ${response.status}`);
  }

  return await response.json();
}

async function updateTask(id, title, description, completed) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        description: description,
        completed: completed
      })
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
}

async function toggleTaskCompletion(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/toggle`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao alterar status da tarefa:', error);
    throw error;
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
}

// FUNÇÕES DE INTERFACE

function showMessage(text, type = 'success') {
  elements.formMessage.textContent = text;
  elements.formMessage.className = `message show ${type}`;

  setTimeout(() => {
    elements.formMessage.classList.remove('show');
  }, 3000);
}

function renderTasks(tasks) {
  elements.loadingSpinner.style.display = 'none';

  if (tasks.length === 0) {
    elements.taskList.style.display = 'none';
    elements.emptyMessage.style.display = 'block';
    return;
  }

  elements.taskList.style.display = 'block';
  elements.emptyMessage.style.display = 'none';
  elements.taskList.innerHTML = '';

  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    elements.taskList.appendChild(taskElement);
  });
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.id = `task-${task.id}`;

  const date = new Date(task.created_at);
  const formattedDate = date.toLocaleDateString('pt-BR', {
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
      ${
        task.description
          ? `<div class="task-description">${escapeHtml(task.description)}</div>`
          : ''
      }
      <div class="task-date">📅 ${formattedDate}</div>
    </div>

    <div class="task-actions">
      <button class="btn btn-edit" onclick="handleEditTask(${task.id})">✏️ Editar</button>
      <button class="btn btn-danger" onclick="handleDeleteTask(${task.id})">🗑️ Deletar</button>
    </div>
  `;

  return li;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// HANDLERS DE EVENTOS

elements.taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = elements.titleInput.value.trim();
  const description = elements.descriptionInput.value.trim();

  if (!title) {
    showMessage('Por favor, insira um título', 'error');
    return;
  }

  const submitBtn = elements.taskForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;

    await createTask(title, description);

    elements.taskForm.reset();

    const tasks = await getTask();
    renderTasks(tasks);

    showMessage('✅ Tarefa adicionada com sucesso!', 'success');
  } catch (error) {
    showMessage(`Erro: ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

async function handleToggleTask(id) {
  try {
    await toggleTaskCompletion(id);

    const tasks = await getTask();
    renderTasks(tasks);

    showMessage('Status da tarefa atualizado com sucesso!', 'success');
  } catch (error) {
    showMessage(`Erro: ${error.message}`, 'error');
  }
}

async function handleEditTask(id) {
  alert('Funcionalidade de edição será implementada em breve.');
}

async function handleDeleteTask(id) {
  const confirmed = confirm('Tem certeza que deseja deletar esta tarefa?');

  if (!confirmed) {
    return;
  }

  try {
    await deleteTask(id);

    const tasks = await getTask();
    renderTasks(tasks);

    showMessage('✅ Tarefa deletada com sucesso!', 'success');
  } catch (error) {
    showMessage(`Erro: ${error.message}`, 'error');
  }
}

// INICIALIZAÇÃO

async function init() {
  console.log('Inicializando Task Manager...');
  elements.loadingSpinner.style.display = 'block';

  const tasks = await getTask();
  renderTasks(tasks);
}

document.addEventListener('DOMContentLoaded', init);