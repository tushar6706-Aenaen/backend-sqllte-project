import express from 'express'
import db from '../db.js'


const router = express.Router();

// get all todos
router.get('/',(req,res)=>{
    const getTodos = db.prepare(`select * from todos wherer user_id = ?`)
    const todos = getTodos.all(req.userID);
})

router.post('/',(req,res)=>{

})

router.put("/:id",()=>{})
router.delete("/:id",()=>{})


export default router