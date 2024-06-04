-- CreateEnum
CREATE TYPE "ApplyStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "UserApplySeeker" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "ApplyStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "UserApplySeeker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserApplySeeker" ADD CONSTRAINT "UserApplySeeker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
