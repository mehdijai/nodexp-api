/*
  Warnings:

  - Made the column `gender` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstname` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `shipping_infos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `shipping_infos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `shipping_infos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `shipping_infos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL,
ALTER COLUMN "adresse" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shipping_infos" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;
