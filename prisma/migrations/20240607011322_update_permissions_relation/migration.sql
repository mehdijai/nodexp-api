/*
  Warnings:

  - You are about to drop the column `roleId` on the `permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "roleId";

-- CreateTable
CREATE TABLE "_role_permission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_role_permission_AB_unique" ON "_role_permission"("A", "B");

-- CreateIndex
CREATE INDEX "_role_permission_B_index" ON "_role_permission"("B");

-- AddForeignKey
ALTER TABLE "_role_permission" ADD CONSTRAINT "_role_permission_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_role_permission" ADD CONSTRAINT "_role_permission_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
