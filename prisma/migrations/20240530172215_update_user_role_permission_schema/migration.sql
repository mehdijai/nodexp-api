/*
  Warnings:

  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `model_has_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_has_permissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "model_has_roles" DROP CONSTRAINT "model_has_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "model_has_roles" DROP CONSTRAINT "model_has_roles_userId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_userId_fkey";

-- DropForeignKey
ALTER TABLE "role_has_permissions" DROP CONSTRAINT "role_has_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_has_permissions" DROP CONSTRAINT "role_has_permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
ADD COLUMN     "roleId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "permissions_id_seq";

-- AlterTable
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "refresh_token_id_seq";

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "roles_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "roleId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- DropTable
DROP TABLE "model_has_roles";

-- DropTable
DROP TABLE "role_has_permissions";

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "company_name" TEXT,
    "company_fj" TEXT,
    "company_ice" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "adresse_shipping" TEXT,
    "postal_code_shipping" TEXT,
    "city_shipping" TEXT,
    "country_shipping" TEXT,
    "statut" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
