import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", age: 30 },
      { name: "Bob", email: "bob@example.com", age: 25 },
      { name: "Charlie", email: "charlie@example.com", age: 35 }
    ]
  });
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });