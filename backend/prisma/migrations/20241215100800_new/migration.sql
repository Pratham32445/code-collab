/*
  Warnings:

  - The values [NEXTJS] on the enum `Template` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Template_new" AS ENUM ('REACT_VITE', 'NEXT_APP', 'EXPO_REACT_NAVITE');
ALTER TABLE "Space" ALTER COLUMN "template" TYPE "Template_new" USING ("template"::text::"Template_new");
ALTER TYPE "Template" RENAME TO "Template_old";
ALTER TYPE "Template_new" RENAME TO "Template";
DROP TYPE "Template_old";
COMMIT;
