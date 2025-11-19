import { ApiProperty } from '@nestjs/swagger';

export class UsuarioBusquedaDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario',
  })
  id: number;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  apellido: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email del usuario',
  })
  mail: string;

  @ApiProperty({
    example: '123456789',
    description: 'Teléfono del usuario',
    required: false,
  })
  telefono?: string;

  @ApiProperty({
    example: false,
    description: 'Indica si ya es contacto del usuario que busca',
  })
  esContacto: boolean;

  @ApiProperty({
    example: 'A',
    description: 'Estado del contacto si ya es contacto (P=Pendiente, A=Aceptado, R=Rechazado)',
    required: false,
  })
  estadoContacto?: string;

  @ApiProperty({
    example: true,
    description: 'Si el contacto está activo (solo si esContacto es true)',
    required: false,
  })
  activoContacto?: boolean;
}