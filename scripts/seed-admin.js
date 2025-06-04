const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@torchgroup.co';
  const password = '$2b$10$Y4wWlMLV5rPlfLGVbi3QEOseR2zve1FWJIdnLSmbDwbBf4TuiXzE.'; // 'Admin@1234'
  const name = 'Admin';
  const role = 'ADMIN';

  const user = await prisma.user.upsert({
    where: { email },
    update: { password, role, name },
    create: {
      email,
      password,
      name,
      role,
    },
  });
  console.log('Admin user upserted:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 