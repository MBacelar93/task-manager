const express = require('express');
const router = express.Router();
const TaskController = require('../controller/taskContoller');


router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post ('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.patch('/:id/toggle', TaskController.toggleTaskCompletion);

module.exports = router;