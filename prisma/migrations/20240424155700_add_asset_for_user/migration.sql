-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
