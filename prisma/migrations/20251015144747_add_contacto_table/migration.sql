-- CreateTable
CREATE TABLE `contacto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `contactoId` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `eliminado` BOOLEAN NOT NULL DEFAULT false,
    `fchCreacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fchActualizacion` DATETIME(0) NOT NULL,
    `fchEliminacion` DATETIME(0) NULL,

    INDEX `contacto_usuarioId_idx`(`usuarioId`),
    INDEX `contacto_contactoId_idx`(`contactoId`),
    INDEX `contacto_activo_idx`(`activo`),
    INDEX `contacto_eliminado_idx`(`eliminado`),
    UNIQUE INDEX `contacto_usuarioId_contactoId_key`(`usuarioId`, `contactoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contacto` ADD CONSTRAINT `contacto_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacto` ADD CONSTRAINT `contacto_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
