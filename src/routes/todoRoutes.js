import express from 'express'
import db from '../db.js'


const router = express.Router();

// get all todos
router.get('/', (req, res) => {
    try {
        console.log('📋 Fetching todos for user:', req.userId);
        const getTodos = db.prepare(`select * from todos where user_id = ?`);
        const todos = getTodos.all(req.userId);
        console.log('✅ Found todos:', todos.length);
        res.json(todos);
    } catch (err) {
        console.error('❌ Error fetching todos:', err.message);
        res.status(500).json({ message: "Error fetching todos" });
    }
})

router.post('/', (req, res) => {
    try {
        const {task} = req.body;
        if (!task) {
            return res.status(400).json({ message: "Task is required" });
        }
        console.log('➕ Creating todo:', task, 'for user:', req.userId);
        const insertTodo = db.prepare(`insert into todos(user_id,task) values (?,?)`);
        const result = insertTodo.run(req.userId, task);
        console.log('✅ Todo created with ID:', result.lastInsertRowid);
        return res.json({id: result.lastInsertRowid, task, completed: 0, user_id: req.userId});
    } catch (err) {
        console.error('❌ Error creating todo:', err.message);
        res.status(500).json({ message: "Error creating todo" });
    }
})

router.put("/:id", (req, res) => {
    try {
        const {completed} = req.body;
        const {id} = req.params;
        console.log('🔄 Updating todo:', id, 'completed:', completed);
        const updatedTodo = db.prepare(`update todos set completed = ? where id = ? and user_id = ?`);
        const result = updatedTodo.run(completed, id, req.userId);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        console.log('✅ Todo updated successfully');
        return res.json({message:"Todo updated successfully"});
    } catch (err) {
        console.error('❌ Error updating todo:', err.message);
        res.status(500).json({ message: "Error updating todo" });
    }
})
router.delete("/:id", (req, res) => {
    try {
        const {id} = req.params;
        console.log('🗑️ Deleting todo:', id);
        const deleteTodo = db.prepare(`delete from todos where id = ? and user_id = ?`);
        const result = deleteTodo.run(id, req.userId);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        console.log('✅ Todo deleted successfully');
        return res.json({message:"Todo deleted successfully"});
    } catch (err) {
        console.error('❌ Error deleting todo:', err.message);
        res.status(500).json({ message: "Error deleting todo" });
    }
})


export default router