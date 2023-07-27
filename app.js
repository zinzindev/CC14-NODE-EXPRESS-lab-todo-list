// Lab 2
// - ให้เขียนโค้ดเพื่อค้นหา เพิ่ม แก้ไข ลบข้อมูล todo lists
// - todo list object มีข้อมูล id, title, completed, dueDate
// - ข้อมูลให้เก็บในไฟล์ todolist.json
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFile, writeFile } = require('fs/promises');
const { readTodo, writeTodo } = require('./dbs/file.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// todo object {
//      id: STRING, UNIQUE, REQUIRED
//      title: STRING, REQUIRED
//      complete: BOOLEAN, REQUIRED, DEFAULT: FALSE
//      dueDate: STRING
// }

// Design โดยใช้ REST API
// 1. ค้นหาทั้งหมด
// METHOD: GET, ENDPOINT URL: /todos
// INPUT: QUERY ( title, complete, dueDate, offset, liimit, sort )
// OUTPUT: ARRAY Todo Object, TOTAL
app.get('/todos', async (req, res) => {
	try {
		const oldTodos = await readTodo();
		res.status(200).json({ total: oldTodos.length, todos: oldTodos });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// 2. ค้นหาด้วย Id
// METHOD: GET, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Todo Object OR NULL
app.get('/todos/:id', async (req, res) => {
	try {
		const { id } = req.params;
		// const data = await readFile('dbs/todolist.json', 'utf-8');
		// const oldTodos = JSON.parse(data);

		const oldTodos = await readTodo();
		const todo = oldTodos.find((item) => item.id === id) ?? null;
		res.status(200).json({ todo });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// 3. เพิ่มข้อมูล
// METHOD: POST, ENDPOINT URL: /todos
// INPUT: BODY ( title: REQUIRED, completed: DEFAULT(FALSE) , dueDate: -)
// OUTPUT: NEW Todo Object OR ERROR Message
app.post('/todos', (req, res) => {
	const { title, completed = false, dueDate } = req.body;

	if (!title || !title.trim()) {
		res.status(400).json({ message: 'title is required' });
	} else if (typeof completed !== 'boolean') {
		res.status(400).json({ message: 'completed must be boolean' });
	} else if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
		res.status(400).json({ message: 'invalid due date' });
	} else {
		const newTodo = { id: uuidv4(), title, completed, dueDate };
		readFile('dbs/todolist.json', 'utf-8')
			.then((data) => {
				const oldTodos = JSON.parse(data);
				oldTodos.unshift(newTodo);
				return writeFile('dbs/todolist.json', JSON.stringify(oldTodos), 'utf-8');
			})
			.then(() => {
				res.status(201).json({ todo: newTodo });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
});

// 4. แก้ไขข้อมูล
// METHOD: PUT, ENDPOINT URL: /todos/:id
// INPUT: BODY ( title: REQUIRED, completed: REQUIRED , dueDate: -)
//        PARAMS (id )
// OUTPUT: UPDATED Todo Object OR ERROR Message
app.put('/todos/:id', async (req, res) => {
	try {
		const { title, completed, dueDate } = req.body;
		const { id } = req.params;

		//validate
		//insert validation here...
		//end validate

		const oldTodo = await readTodo();
		const newTodo = { title, completed, dueDate, id };
		const newTodos = oldTodo.map((item) => (item.id === id ? newTodo : item));
		await writeTodo(newTodos);
		res.status(200).json({ todo: newTodo });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// 5. ลบข้อมูล
// METHOD: DELETE, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Success Message OR ERROR Message
app.delete('/todos/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const oldTodos = await readTodo();
		const newTodos = oldTodos.filter((item) => item.id !== id);
		await writeTodo(newTodos);
		res.status(200).json({ message: 'success delete' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.listen(8000, () => console.log('server running on port: 8000'));
