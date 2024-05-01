import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: '123123a',
      role: 'ADMIN',
      name: 'Admin',
      phone_number: '0987654321',
      address: 'Duy Tân, Cầu Giấy, Hà Nội',
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: 'poster_1@gmail.com',
      password: '123123a',
      role: 'JOB_POSTER',
      name: 'Nguyễn Văn A',
      phone_number: '0987654321',
      address: 'Duy Tân, Cầu Giấy, Hà Nội',
    },
  });

  await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      email: 'seeker_1@gmail.com',
      password: '123123a',
      role: 'JOB_SEEKER',
      name: 'Nguyễn Văn C',
      phone_number: '0987654321',
      address: 'Duy Tân, Cầu Giấy, Hà Nội',
    },
  });

  await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'IT',
      description: 'IT task',
      price: 1000000,
      status: 'PENDING',
      start_date: new Date(),
      working_time: 2,
      type: 'HOUSE_CLEANING',
      job_poster_id: 2,
      payment_method: 'CASH',
    },
  });

  console.log('seed success');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
