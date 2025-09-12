import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'


const router = express.Router();


router.post('/register', (req, res) => {
    console.log('📝 Register request received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('❌ Missing username or password');
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 8)
    console.log('🔐 Password hashed successfully');

    try {
        // insert the user into the database
        const insertUser = db.prepare(`insert into user(username,password) VALUES (?,?) `);
        const result = insertUser.run(username, hashedPassword)
        console.log('✅ User inserted, ID:', result.lastInsertRowid);

        // create a default todo for the user
        const defaultTodo = `hello add your first todo`;
        const insertTodo = db.prepare(`insert into todos(user_id,task)  VALUES (?,?) `)
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        console.log('✅ Default todo created');

        // create token for the user
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        console.log('✅ Token created:', token.substring(0, 20) + '...');

        // respond with the token
        res.json({ token })
        console.log('✅ Registration successful for user:', username);

    } catch (err) {
        console.error('❌ Registration error:', err.message);
        return res.status(503).json({ message: "error registering user", error: err.message });
    }
})

router.post('/login', (req, res) => {
    console.log('🔐 Login request received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('❌ Missing username or password');
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        //get the user from the database
        const getUser = db.prepare(`select * from user where username = ?`);
        const user = getUser.get(username);
        console.log('🔍 User found:', user ? 'Yes' : 'No');
        
        //if user does not exist
        if (!user) {
            console.log('❌ User not found:', username);
            return res.status(404).json({ message: "user not found" })
        }

        //compare the password with hashed password
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        console.log('🔐 Password valid:', passwordIsValid);

        //if password does not match
        if (!passwordIsValid) {
            console.log('❌ Invalid password for user:', username);
            return res.status(401).send({ message: "Invalid password " });
        }

        //then we have successful authentication
        //create a token for the user
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        console.log('✅ Login successful for user:', username);
        console.log('🎟️ Token created:', token.substring(0, 20) + '...');
        res.json({ token })
    } catch (err) {
        console.error('❌ Login error:', err.message);
        return res.status(503).json({ message: "error logging in user", error: err.message });
    }
})


export default router