const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();
router
	.route('/')
	.get(todoController.getAllTodos) // dispatcher to controller
	.post(todoController.createTodo);

router
	.route('/:id')
	.get(todoController.getTodoById)
	.put(todoController.updateTodo)
	.delete(todoController.deleteTodo);

module.exports = router;
