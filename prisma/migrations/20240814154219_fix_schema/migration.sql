/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm";

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm";
