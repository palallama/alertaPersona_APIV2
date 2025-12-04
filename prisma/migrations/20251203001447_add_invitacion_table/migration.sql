-- CreateTable
CREATE TABLE `invitacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `estado` CHAR(1) NOT NULL DEFAULT 'P',
    `mensaje` TEXT NULL,
    `fchCreacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fchExpiracion` DATETIME(0) NOT NULL,
    `fchRespuesta` DATETIME(0) NULL,
    `usuarioRegistradoId` INTEGER NULL,

    UNIQUE INDEX `invitacion_codigo_key`(`codigo`),
    INDEX `invitacion_usuarioId_idx`(`usuarioId`),
    INDEX `invitacion_email_idx`(`email`),
    INDEX `invitacion_codigo_idx`(`codigo`),
    INDEX `invitacion_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitacion` ADD CONSTRAINT `invitacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
