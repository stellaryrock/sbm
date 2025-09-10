import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const mbrs = [
  {
    email: "stellaryrock@gmail.com",
    nickname: "zinn",
    image: "https://avatars.githubusercontent.com/u/145004495?v=4&size=64",
    Book: {
      create: [
        {
          title: "Book 1",
          Mark: {
            create: {
              link: "https://github.com/indiflex/sbm",
              title: "Mark 1",
              descript: "seeding...",
            },
          },
        },
      ],
    },
  },
];

async function main() {
  for (const mbr of mbrs) {
    const rs = await prisma.member.upsert({
      where: { email: mbr.email },
      update: {},
      create: { ...mbr },
    });

    console.log("🚀 ~ main ~ rs:", rs);
  }
}

main()
  .catch(async (e) => {
    console.error("Prisma Seeding Error >>>", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.error("Prisma Closed!");
  });
