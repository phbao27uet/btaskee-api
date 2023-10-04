import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/utils/constants';

const prisma = new PrismaClient();

const generateUsers = async () => {
  const password = await bcrypt.hash('123123a', SALT_ROUNDS);

  return [
    {
      id: 1,
      name: 'Zen 1',
      email: 'zen_1@gmail.com',
      password: password,
      refresh_token: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
};

async function main() {
  const users = await generateUsers();

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
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
