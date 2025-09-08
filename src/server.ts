import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/users', (req, res) => {       
    res.json({ message: 'Get all users' });
}); 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
