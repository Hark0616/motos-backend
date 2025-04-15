/*
  Warnings:

  - Changed the type of `tipo` on the `Gasto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoGasto" AS ENUM ('ALQUILER', 'MECANICO', 'COMISION', 'COMIDA', 'MATERIALES', 'TRASPASO', 'REPUESTOS', 'MANTENIMIENTO', 'OTROS');

-- AlterTable
ALTER TABLE "Gasto" ADD COLUMN     "comprobante" TEXT,
ADD COLUMN     "fechaPago" TIMESTAMP(3),
ADD COLUMN     "notas" TEXT,
ADD COLUMN     "pagado" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoGasto" NOT NULL;

-- CreateTable
CREATE TABLE "Comision" (
    "id" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" TIMESTAMP(3),
    "motoId" INTEGER NOT NULL,
    "ventaId" INTEGER,
    "notas" TEXT,

    CONSTRAINT "Comision_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comision" ADD CONSTRAINT "Comision_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comision" ADD CONSTRAINT "Comision_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
