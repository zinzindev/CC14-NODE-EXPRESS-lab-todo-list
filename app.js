// Lab 2
// - ให้เขียนโค้ดเพื่อค้นหา เพิ่ม แก้ไข ลบข้อมูล todo lists
// - todo list object มีข้อมูล id, title, completed, dueDate
// - ข้อมูลให้เก็บในไฟล์ todolist.json
const express = require('express');

const todoRoute = require('./routes/todoRoute.js');
const errorMiddleware = require('./middlewares/error');
const notFoundMiddleware = require('./middlewares/notFound');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/todos', todoRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

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

// 2. ค้นหาด้วย Id
// METHOD: GET, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Todo Object OR NULL

// 3. เพิ่มข้อมูล
// METHOD: POST, ENDPOINT URL: /todos
// INPUT: BODY ( title: REQUIRED, completed: DEFAULT(FALSE) , dueDate: -)
// OUTPUT: NEW Todo Object OR ERROR Message

// 4. แก้ไขข้อมูล
// METHOD: PUT, ENDPOINT URL: /todos/:id
// INPUT: BODY ( title: REQUIRED, completed: REQUIRED , dueDate: -)
//        PARAMS (id )
// OUTPUT: UPDATED Todo Object OR ERROR Message

// 5. ลบข้อมูล
// METHOD: DELETE, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Success Message OR ERROR Message

app.listen(8000, () => console.log('server running on port: 8000'));
