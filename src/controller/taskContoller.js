const TaskModel = require('../models/taskModel');

const getAllTasks = (req, res) => {
  TaskModel.getAllTasks((err, tasks) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao buscar tarefas',
        message: err.message
      });
    }

    res.status(200).json(tasks);
  });
};

const getTaskById = (req, res) => {
  const { id } = req.params;

  TaskModel.getTaskById(id, (err, task) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao buscar tarefa',
        message: err.message
      });
    }

    if (!task) {
      return res.status(404).json({
        error: 'Tarefa não encontrada'
      });
    }

    res.status(200).json(task);
  });
};

const createTask = (req, res) => {
  try {
    console.log('BODY RECEBIDO:', req.body);

    const { title, description } = req.body || {};

    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'O título é obrigatório'
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        error: 'O título não pode ter mais que 255 caracteres'
      });
    }

    TaskModel.createTask(title, description || '', (err, taskId) => {
      if (err) {
        return res.status(500).json({
          error: 'Erro ao criar tarefa',
          message: err.message
        });
      }

      res.status(201).json({
        id: taskId,
        title: title,
        description: description || '',
        completed: 0,
        message: 'Tarefa criada com sucesso'
      });
    });
  } catch (error) {
    console.error('Erro em createTask:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body || {};

  if (!title || title.trim() === '') {
    return res.status(400).json({
      error: 'O título é obrigatório'
    });
  }

  TaskModel.updateTask(id, title, description || '', completed || 0, (err, changes) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao atualizar tarefa',
        message: err.message
      });
    }

    if (changes === 0) {
      return res.status(404).json({
        error: 'Tarefa não encontrada'
      });
    }

    res.status(200).json({
      message: 'Tarefa atualizada com sucesso',
      id: id
    });
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  TaskModel.deleteTask(id, (err, changes) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao deletar tarefa',
        message: err.message
      });
    }

    if (changes === 0) {
      return res.status(404).json({
        error: 'Tarefa não encontrada'
      });
    }

    res.status(200).json({
      message: 'Tarefa deletada com sucesso!',
      id: id
    });
  });
};

const toggleTaskCompletion = (req, res) => {
  const { id } = req.params;

  TaskModel.toggleTaskCompletion(id, (err, changes) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao alternar status da tarefa',
        message: err.message
      });
    }

    if (changes === 0) {
      return res.status(404).json({
        error: 'Tarefa não encontrada'
      });
    }

    res.status(200).json({
      message: 'Status da tarefa alterado com sucesso!',
      id: id
    });
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
};