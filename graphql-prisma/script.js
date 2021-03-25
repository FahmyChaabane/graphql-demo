const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
    data: {
      name: "Mario",
      email: "mario@prisma.io",
      posts: {
        create: { title: "Hello World" },
      },
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  });
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.log(allUsers);
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
