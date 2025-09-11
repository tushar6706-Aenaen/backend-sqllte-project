import express  from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'

const app = express();
const PORT = process.env.PORT || 5003;

// get file path from the url of the  current module 
const __filename = fileURLToPath(import.meta.url);

// get directory name from the public/directory 
const __dirname = dirname(__filename)


// middleware
app.use(express.json())
// serves the html file from the public directory
//tell express to serve all files from the public directory / file. any request from css files will be RESOLVED from the public directory

app.use(express.static(path.join(__dirname,'../public')));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html')); 
});

app.use('/auth',authRoutes)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
