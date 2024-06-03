/*
  Warnings:

  - The primary key for the `customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adresse_shipping` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `city_shipping` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `company_fj` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `company_ice` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `country_shipping` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code_shipping` on the `customers` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP CONSTRAINT "customers_pkey",
DROP COLUMN "adresse_shipping",
DROP COLUMN "city_shipping",
DROP COLUMN "company_fj",
DROP COLUMN "company_ice",
DROP COLUMN "company_name",
DROP COLUMN "country_shipping",
DROP COLUMN "created_by",
DROP COLUMN "number",
DROP COLUMN "postal_code",
DROP COLUMN "postal_code_shipping",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "customers_id_seq";

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rc" TEXT NOT NULL,
    "legalStatus" TEXT NOT NULL,
    "ice" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_infos" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "country" TEXT,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_infos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipping_infos_customerId_key" ON "shipping_infos"("customerId");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_infos" ADD CONSTRAINT "shipping_infos_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
