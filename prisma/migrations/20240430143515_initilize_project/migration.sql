-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'JOB_POSTER', 'JOB_SEEKER');

-- CreateEnum
CREATE TYPE "StatusTask" AS ENUM ('CANCELLED', 'COMPLETED', 'IN_PROGRESS', 'PENDING', 'UNPAID', 'HIRING');

-- CreateEnum
CREATE TYPE "TypeTask" AS ENUM ('HOUSE_CLEANING', 'DEEP_CLEANING', 'AIR_CONDITIONER_CLEANING', 'CHILDCARE', 'WASHING_MACHINE_CLEANING', 'IRONING');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'PAYPAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "refresh_token" TEXT,
    "role" "Role" NOT NULL DEFAULT 'JOB_POSTER',
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusTask" NOT NULL,
    "type" "TypeTask" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "working_time" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "job_poster_id" INTEGER NOT NULL,
    "job_seeker_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "total_price" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_job_poster_id_fkey" FOREIGN KEY ("job_poster_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
