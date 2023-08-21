// import prisma from './utils/db.server';

// // async function main() {
// //   const user = await prisma.user.create({
// //     data: {
// //       username: 'Bayo',
// //       email: 'Bayo@email.com',
// //       password: '123456',
// //       profile: {
// //         create: {
// //           bio: 'I like being weird',
// //         },
// //       },
// //     },
// //   });
// //   console.log(user);
// // }

// async function main() {
//   // answer to question 1
//   const answer = await prisma.answer.create({
//     data: {
//       content:
//         'You can access the Prisma Client instance anywhere in your codebase using the prisma global instance, or you could just check out their official docs',
//       question: {
//         connect: {
//           id: 1,
//         },
//       },
//       author: {
//         connect: {
//           id: 1,
//         },
//       },
//     },
//   });
//   console.log(answer);
// }

// async function main() {
//   // follow user 1
//   const follow = await prisma.follows.create({
//     data: {
//       follower: {
//         connect: {
//           id: 1,
//         },
//       },
//       following: {
//         connect: {
//           id: 3,
//         },
//       },
//     },
//   });
//   console.log(follow);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
