const { v4: uuidv4 } = require('uuid');
const { readTodo, writeTodo } = require('../dbs/fileio');

//.route('/')
exports.getAllTodos = async (req, res, next) => {
	try {
		const oldTodos = await readTodo();
		res.status(200).json({ total: oldTodos.length, todos: oldTodos });
	} catch (error) {
		next(error);
	}
};

exports.createTodo = async (req, res, next) => {
	try {
		const { title, completed = false, dueDate } = req.body;

		if (!title || !title.trim()) {
			return res.status(400).json({ message: 'title is required' });
		}
		if (typeof completed !== 'boolean') {
			return res.status(400).json({ message: 'completed must be boolean' });
		}
		if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
			return res.status(400).json({ message: 'invalid due date' });
		}

		const newTodo = { id: uuidv4(), title, completed, dueDate };
		const oldTodos = await readTodo();
		oldTodos.unshift(newTodo);
		await writeTodo(oldTodos);
		res.status(201).json({ todo: newTodo });
	} catch (error) {
		next(error);
	}
};

// .route('/:id')
exports.getTodoById = async (req, res, next) => {
	try {
		const { id } = req.params;
		// const data = await readFile('dbs/todolist.json', 'utf-8');
		// const oldTodos = JSON.parse(data);

		const oldTodos = await readTodo();
		const todo = oldTodos.find((item) => item.id === id) ?? null;
		res.status(200).json({ todo });
	} catch (error) {
		next(error);
	}
};

exports.updateTodo = async (req, res, next) => {
	try {
		const { title, completed, dueDate } = req.body;
		const { id } = req.params;

		//validate
		//insert validation here...
		//end validate

		const oldTodo = await readTodo();
		const newTodo = { id, title, completed, dueDate };
		const newTodos = oldTodo.map((item) => (item.id === id ? newTodo : item));
		await writeTodo(newTodos);
		res.status(200).json({ todo: newTodo });
	} catch (error) {
		next(error);
	}
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const oldTodos = await readTodo();
        const newTodos = oldTodos.filter((item) => item.id !== id);
        await writeTodo(newTodos);
        res.status(200).json({ message: 'success delete' });
    } catch (error) {
        next(error);
    }
}
