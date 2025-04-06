import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Ideally hashed
      role: UserRole.ADMIN,
      notices: {
        create: [
          {
            title: 'Platform Launch',
            content: 'We are excited to launch our new platform!',
            important: true,
          },
          {
            title: 'Security Update',
            content: 'Please update your passwords regularly.',
          },
        ],
      },
    },
  });

  // Teacher User
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      name: 'Mr. Sharma',
      email: 'teacher@example.com',
      password: 'teacher123',
      role: UserRole.TEACHER,
      notices: {
        create: [
          {
            title: 'Class Schedule Update',
            content: 'Class timings have changed for next week.',
          },
          {
            title: 'Assignment Reminder',
            content: 'Submit assignments before Friday.',
            important: true,
          },
        ],
      },
    },
  });

  // Student Users
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'Alice Khan',
      email: 'student1@example.com',
      password: 'student123',
      role: UserRole.STUDENT,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      name: 'Rahul Verma',
      email: 'student2@example.com',
      password: 'student123',
      role: UserRole.STUDENT,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@example.com' },
    update: {},
    create: {
      name: 'Neha Singh',
      email: 'student3@example.com',
      password: 'student123',
      role: UserRole.STUDENT,
    },
  });

  console.log('Seeded users and notices:', {
    adminUser,
    teacherUser,
    student1,
    student2,
    student3,
  });
}

main()
  .catch((e) => {
    console.error('Error while seeding:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
