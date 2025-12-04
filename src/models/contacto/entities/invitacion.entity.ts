import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Invitacion {
  @ApiProperty({ description: 'ID de la invitación' })
  id: number;

  @ApiProperty({ description: 'ID del usuario que envía la invitación' })
  usuarioId: number;

  @ApiProperty({ description: 'Email del invitado' })
  email: string;

  @ApiPropertyOptional({ description: 'Teléfono del invitado' })
  telefono?: string;

  @ApiProperty({ description: 'Código único de invitación' })
  codigo: string;

  @ApiProperty({ 
    description: 'Estado de la invitación',
    enum: ['P', 'A', 'R', 'E'],
    example: 'P'
  })
  estado: string;

  @ApiPropertyOptional({ description: 'Mensaje personalizado' })
  mensaje?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  fchCreacion: Date;

  @ApiProperty({ description: 'Fecha de expiración' })
  fchExpiracion: Date;

  @ApiPropertyOptional({ description: 'Fecha de respuesta' })
  fchRespuesta?: Date;

  @ApiPropertyOptional({ description: 'ID del usuario que aceptó la invitación' })
  usuarioRegistradoId?: number;

  @ApiPropertyOptional({ description: 'Link de invitación' })
  link?: string;
}
