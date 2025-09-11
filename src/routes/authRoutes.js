import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { hash } from 'crypto';

const router = express.Router();


router.post('/register',(req,res)=>{
    const {username,password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,8)

    try{
        const insertUser = db.prepare(`insert into user(username,password) VALUES (?,?) ` );
        const result = insertUser.run(username,hashedPassword)


        const defaultTodo = `hello add your first todo`;
        const insertTodo = db.prepare(`insert into todos(user_id,task)  `)
        insertTodo.run(result.lastInsertRowid,defaultTodo)

        // create token for the user
        const token = jwt.sign({id:result.lastInsertRowid},process.env.JWT_SECRET,{expiresIn:'24h'})

            res.json({token})
        return res.status(201).json({message:"user registered successfully",password:hashedPassword})
    }catch(err){
        return res.status(503).json({message:"error registering user"});
    }
})

router.post('/login',(req,res)=>{

})


export default router