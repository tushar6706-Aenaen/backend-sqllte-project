import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'


const router = express.Router();


router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        // insert the user into the database
        const insertUser = db.prepare(`insert into user(username,password) VALUES (?,?) `);
        const result = insertUser.run(username, hashedPassword)

        // create a default todo for the user
        const defaultTodo = `hello add your first todo`;
        const insertTodo = db.prepare(`insert into todos(user_id,task)  VALUES (?,?) `)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create token for the user
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })

        // respond with the token
        
        res.json({ token })

    } catch (err) {
        return res.status(503).json({ message: "error registering user" });
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        //get the user from the database
        const getUser = db.prepare(`select * from user where username = ?`);
        const user = getUser.get(username);
        //if user does not exist
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        //compare the password with hashed password
        const passwordIsValid = bcrypt.compareSync(password, user.password);


        //if password does not match

        if (!passwordIsValid) {
            res.status(401).send({ message: "Invalid password " });
        }


        //then we have successful authentication
        //create a token for the user
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'24h'})
        console.log(user)
        res.json({token})
    } catch (err) {
        console.log(err.message)
        return res.status(503).json({ message: "error logging in user" });
    }
})


export default router