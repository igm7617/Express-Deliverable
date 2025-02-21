import express, { request, response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();
// the below set up bodyParser to handle data from React or Postman
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// process.env.NAME gets the value of NAME from your .env file
const port = process.env.PORT;
app.use(cors({ origin: 'http://localhost:5173' }));

const db = mysql.createConnection({
    host: 'thresholds-test.mysql.database.azure.com',
    user: process.env.PF, // Replace with your MySQL username
    port: 3306, // Replace with the port you need - may be different from mine
    password: process.env.PASSWORD, // Replace with your MySQL password
    database: 'igomez_tasks', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// app.get, .post, .push - these are all set to handle different
// HTTP verbs/methods - we should talk about these
app.get('/', (req, res) => {
    res.send('This is totally fine');
});

// route get
app.get('/task', (req, res) => {
    const query = 'SELECT * FROM tasks;';

    db.query(query, (err, results) => {
        if (err) {
            console.log('It was not possible to find this tasks');
            console.log(err);
            res.status(500).json({error: 'Error getting tasks.'})
        }
        else {
            res.json({ message: "There you have all the tasks", results });
        }
    })
})

// new route to add a task to the database
app.post('/task', (req, res) => {

    const params = [req.body['title'], req.body['description'], req.body['is_completed']];
    console.log(req.body)
    const query = 'INSERT INTO tasks (title, description, is_completed) VALUES (?,?,?)';

    db.query(query, params, (err, results) => {
        if (err) {
            console.log("It was not possible to create a new task");
            console.log(err);
            res.status(500).json({error: 'Error adding task to database.'})
        }
        else {
            res.status(200).json({ message: "Task created successfully", results });
        }
    })
})

// UPDATE single title
app.put('/task/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10); // Ensure ID is an integer
    const { title, description, is_completed } = req.body;
 
    // Debugging: Log the ID and received data
    console.log("Updating task with ID:", taskId);
    console.log("Received data:", req.body);
 
    // Validate input
    if (!title || !description || is_completed === undefined) {
        return res.status(400).json({ error: 'All fields (title, description, is_completed) are required' });
    }
 
    const query = 'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?';
    const params = [title, description, is_completed, taskId];
 
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'Error updating task' });
        }
 
        console.log("MySQL Results:", results); // Debugging line
 
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
 
        res.json({ message: 'Task updated successfully' });
    });
});

// DELETE single
app.delete('/task/:id', (req, res) => {
    const taskId = req.params.id; // Get ID from URL parameter

    const query = "DELETE FROM tasks WHERE id = ?"; 

    db.query(query, [taskId], (err, results) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Error deleting task." });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    });
});

// starts the app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})