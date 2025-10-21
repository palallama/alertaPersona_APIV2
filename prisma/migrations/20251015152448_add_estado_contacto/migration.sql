-- AlterTable
ALTER TABLE `contacto` ADD COLUMN `estado` CHAR(1) NOT NULL DEFAULT 'P',
    ADD COLUMN `fchRespuesta` DATETIME(0) NULL;

-- CreateIndex
CREATE INDEX `contacto_estado_idx` ON `contacto`(`estado`);
