import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
const app = express();



app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      age: {
        gt: 30
      },

    },
    
  });
  res.json(users);
}
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});