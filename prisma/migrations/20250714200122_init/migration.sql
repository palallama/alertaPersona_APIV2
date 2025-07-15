-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `nroDocumento` VARCHAR(8) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `nroTramite` VARCHAR(11) NOT NULL,
    `genero` VARCHAR(1) NOT NULL,
    `fchNacimiento` DATETIME(0) NOT NULL,
    `mail` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `validado` BOOLEAN NOT NULL DEFAULT false,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fechaCreacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ultimoAcceso` DATETIME(0) NULL,

    UNIQUE INDEX `usuario_mail_key`(`mail`),
    INDEX `usuario_activo_idx`(`activo`),
    INDEX `usuario_mail_idx`(`mail`),
    INDEX `usuario_nroDocumento_idx`(`nroDocumento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,
    `estado` CHAR(1) NOT NULL DEFAULT 'E',
    `fchEmision` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fchCierre` DATETIME(0) NULL,
    `cerrada` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asistente` (
    `alertaId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `estado` CHAR(1) NOT NULL,
    `observacion` VARCHAR(191) NULL,

    PRIMARY KEY (`alertaId`, `usuarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `fchEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leida` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarioPreferencia` (
    `usuarioId` INTEGER NOT NULL,
    `clave` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`usuarioId`, `clave`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarioAdicional` (
    `usuarioId` INTEGER NOT NULL,
    `clave` VARCHAR(191) NOT NULL,
    `valor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`usuarioId`, `clave`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alerta` ADD CONSTRAINT `alerta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistente` ADD CONSTRAINT `asistente_alertaId_fkey` FOREIGN KEY (`alertaId`) REFERENCES `alerta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistente` ADD CONSTRAINT `asistente_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacion` ADD CONSTRAINT `notificacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarioPreferencia` ADD CONSTRAINT `usuarioPreferencia_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarioAdicional` ADD CONSTRAINT `usuarioAdicional_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
