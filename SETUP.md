npm init -y
npm install prisma --save-dev
npm install @prisma/client
npm i express 
npx prisma migrate dev --name init 
npx prisma generate


package.json =>
 "prisma":{
    "seed":"ts-node prisma/seed.ts"
  },

npx prisma db seed