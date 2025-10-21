import { ApiProperty } from '@nestjs/swagger';

export class Contacto {
  @ApiProperty({
    example: 1,
    description: 'ID único del contacto',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que solicita tener el contacto',
  })
  usuarioId: number;

  @ApiProperty({
    example: 2,
    description: 'ID del usuario que es solicitado como contacto',
  })
  contactoId: number;

  @ApiProperty({
    example: 'P',
    description: 'Estado de la solicitud: P=Pendiente, A=Aceptado, R=Rechazado',
    enum: ['P', 'A', 'R'],
  })
  estado: string;

  @ApiProperty({
    example: true,
    description: 'Si se notifica a este contacto cuando esté aceptado',
  })
  activo: boolean;

  @ApiProperty({
    example: false,
    description: 'Indica si el contacto fue eliminado (soft delete)',
  })
  eliminado: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación de la solicitud',
  })
  fchCreacion: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de última actualización',
  })
  fchActualizacion: Date;

  @ApiProperty({
    example: null,
    description: 'Fecha de eliminación lógica',
    required: false,
  })
  fchEliminacion?: Date;

  @ApiProperty({
    example: null,
    description: 'Fecha cuando se aceptó o rechazó la solicitud',
    required: false,
  })
  fchRespuesta?: Date;

  // Relaciones opcionales
  @ApiProperty({
    description: 'Información del usuario que solicita',
    required: false,
  })
  usuario?: any;

  @ApiProperty({
    description: 'Información del usuario solicitado como contacto',
    required: false,
  })
  contactoUsuario?: any;
}
