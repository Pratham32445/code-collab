/*
  Warnings:

  - Added the required column `template` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Template" AS ENUM ('REACT_VITE', 'NEXTJS', 'EXPO_REACT_NAVITE');

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "template" "Template" NOT NULL;
