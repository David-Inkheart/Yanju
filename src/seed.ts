import prisma from './utils/db.server';

async function main() {
  // prisma client queries
  // const user = await prisma.user.create({
  //   data: {
  //     username: 'David',
  //     email: 'david@email.com',
  //     password: 'password',
  //     profile: {
  //       create: {
  //         bio: 'I like animes and xanxia novels',
  //       },
  //     },
  //     question: {
  //       create: {
  //         title: 'How to use Prisma Client',
  //         content: 'How to use Prisma Client to perform common database operations',
  //       },
  //     },
  //   },
  // })
  // const usersWithQuestions = await prisma.user.findMany({
  //   include: {
  //     profile: true,
  //     question: true,
  //     _count: {
  //       select: {
  //         question: true,
  //         answer: true,
  //         follower: true,
  //         following: true,
  //       },
  //     },
  //   }
  // })
  // console.dir(usersWithQuestions, { depth: null })
  // const user = await prisma.user.update({
  //   where: { id: 2 },
  //   data: {
  //     profile: {
  //       update: {
  //         bio: 'I like to pretend I am a ninja',
  //       },
  //     },
  //   },
  // })
  // const user = await prisma.user.findUnique({
  //   where: { id: 2 },
  //   include: {
  //     profile: true,
  //     question: true,
  //   },
  // });
  // console.dir(user, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    // console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
