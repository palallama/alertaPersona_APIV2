import { ApiProperty } from '@nestjs/swagger';

export class UsuarioAlertaDto {
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
    example: '+5491123456789',
    description: 'Teléfono del usuario',
  })
  telefono: string;
}

export class AlertaActivaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la alerta',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que emitió la alerta',
  })
  usuarioId: number;

  @ApiProperty({
    example: -34.6037,
    description: 'Latitud de la ubicación',
  })
  latitud: number;

  @ApiProperty({
    example: -58.3816,
    description: 'Longitud de la ubicación',
  })
  longitud: number;

  @ApiProperty({
    example: 'E',
    description: 'Estado de la alerta (E=Emergencia, H=Ayuda, W=Advertencia)',
  })
  estado: string;

  @ApiProperty({
    example: '2025-12-05T10:30:00.000Z',
    description: 'Fecha y hora de emisión',
  })
  fchEmision: Date;

  @ApiProperty({
    example: null,
    description: 'Fecha y hora de cierre',
    nullable: true,
  })
  fchCierre: Date | null;

  @ApiProperty({
    example: false,
    description: 'Indica si la alerta está cerrada',
  })
  cerrada: boolean;

  @ApiProperty({
    type: UsuarioAlertaDto,
    description: 'Información del usuario que emitió la alerta',
  })
  usuario: UsuarioAlertaDto;
}

export class ActiveContactAlertsResponseDto {
  @ApiProperty({
    type: [AlertaActivaDto],
    description: 'Lista de alertas activas de contactos',
  })
  alerts: AlertaActivaDto[];

  @ApiProperty({
    example: 5,
    description: 'Cantidad total de alertas activas',
  })
  count: number;
}
