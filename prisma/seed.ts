import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.department.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "IT",
      address: "Tầng 4 Toà nhà Sông Đà, 17 Duy Tân, Cầu Giấy, Hà Nội",
    },
  });
  await prisma.department.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Kế toán",
      address: "Tầng 4 Toà nhà Sông Đà, 17 Duy Tân, Cầu Giấy, Hà Nội",
    },
  });
  await prisma.department.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Hành chính nhân sự",
      address: "Tầng 4 Toà nhà Sông Đà, 17 Duy Tân, Cầu Giấy, Hà Nội",
    },
  });

  await prisma.supplier.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "FPT",
      email: "fpt@gmail.com",
      phone_number: "0987654321",
      address: "Tầng 4 Toà nhà Sông Đà, 17 Duy Tân, Cầu Giấy, Hà Nội",
    },
  });

  await prisma.supplier.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "MSI",
      email: "msi@gmail.com",
      phone_number: "0987654321",
      address: "Tầng 4 Toà nhà Sông Đà, 17 Duy Tân, Cầu Giấy, Hà Nội",
    },
  });

  await prisma.asset.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Laptop",
      asset_code: "LAP001",
      department_id: 1,
      supplier_id: 1,
      condition: "GOOD",
      status: "READY_TO_USE",
      entry_price: 10000000,
      entry_time: new Date(),
    },
  });

  await prisma.asset.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Màn hình 24 inch",
      asset_code: "SCREEN001",
      supplier_id: 2,
      condition: "GOOD",
      status: "READY_TO_USE",
      entry_price: 10000000,
      entry_time: new Date(),
    },
  });

  await prisma.asset.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Máy in",
      asset_code: "PRINTER001",
      supplier_id: 2,
      condition: "GOOD",
      status: "READY_TO_USE",
      entry_price: 10000000,
      entry_time: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: "admin@gmail.com",
      password: "123123a",
      role: "ADMIN",
      name: "Admin",
      phone_number: "0987654321",
      address: "Duy Tân, Cầu Giấy, Hà Nội",
      username: "admin",
      department_id: 1,
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: "manager_1@gmail.com",
      password: "123123a",
      role: "MANAGER",
      name: "Manager 1",
      phone_number: "0987654321",
      address: "Duy Tân, Cầu Giấy, Hà Nội",
      username: "manager_1",
      department_id: 1,
    },
  });

  await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      email: "worker_1@gmail.com",
      password: "123123a",
      role: "WORKER",
      name: "Worker 1",
      phone_number: "0987654321",
      address: "Duy Tân, Cầu Giấy, Hà Nội",
      username: "worker_1",
      department_id: 1,
    },
  });

  console.log("seed success");
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
