import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad para documentar las respuestas de estadísticas
 * Las estadísticas son calculadas dinámicamente, no son entidades persistidas
 */

export class EstadoPorCantidad {
  @ApiProperty({ description: 'Estado de la alerta', example: 'E' })
  estado: string;

  @ApiProperty({ description: 'Cantidad de alertas en ese estado', example: 15 })
  cantidad: number;
}

export class UsuarioPorCantidad {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  usuarioId: number;

  @ApiProperty({ description: 'Cantidad de alertas del usuario', example: 15 })
  cantidad: number;
}

export class GeneroPorCantidad {
  @ApiProperty({ description: 'Género del usuario', example: 'M' })
  genero: string;

  @ApiProperty({ description: 'Cantidad de usuarios de ese género', example: 120 })
  cantidad: number;
}

export class FiltrosAplicados {
  @ApiProperty({
    description: 'Fecha de inicio del filtro',
    example: '2025-01-01T00:00:00.000Z',
    nullable: true,
  })
  desde: string | null;

  @ApiProperty({
    description: 'Fecha de fin del filtro',
    example: '2025-12-31T23:59:59.999Z',
    nullable: true,
  })
  hasta: string | null;
}

export class FiltrosAlertasAplicados extends FiltrosAplicados {
  @ApiProperty({
    description: 'Estado filtrado',
    example: 'E',
    nullable: true,
  })
  estado?: string | null;
}

export class EstadisticaAlertasPorUsuario {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  usuarioId: number;

  @ApiProperty({ description: 'Total de alertas', example: 15 })
  total: number;

  @ApiProperty({ description: 'Alertas abiertas', example: 3 })
  abiertas: number;

  @ApiProperty({ description: 'Alertas cerradas', example: 12 })
  cerradas: number;

  @ApiProperty({
    description: 'Cantidad de alertas por estado',
    type: [EstadoPorCantidad],
  })
  porEstado: EstadoPorCantidad[];

  @ApiProperty({ description: 'Filtros aplicados', type: FiltrosAplicados })
  filtros: FiltrosAplicados;
}

export class EstadisticaAlertasTotales {
  @ApiProperty({ description: 'Total de alertas', example: 150 })
  total: number;

  @ApiProperty({ description: 'Alertas abiertas', example: 25 })
  abiertas: number;

  @ApiProperty({ description: 'Alertas cerradas', example: 125 })
  cerradas: number;

  @ApiProperty({
    description: 'Cantidad de alertas por estado',
    type: [EstadoPorCantidad],
  })
  porEstado: EstadoPorCantidad[];

  @ApiProperty({
    description: 'Top 10 usuarios con más alertas',
    type: [UsuarioPorCantidad],
  })
  top10Usuarios: UsuarioPorCantidad[];

  @ApiProperty({ description: 'Filtros aplicados', type: FiltrosAplicados })
  filtros: FiltrosAplicados;
}

export class EstadisticaAlertasEmitidas {
  @ApiProperty({ description: 'Total de alertas emitidas', example: 150 })
  total: number;

  @ApiProperty({ description: 'Alertas abiertas', example: 25 })
  abiertas: number;

  @ApiProperty({ description: 'Alertas cerradas', example: 125 })
  cerradas: number;

  @ApiProperty({
    description: 'Cantidad de alertas por estado',
    type: [EstadoPorCantidad],
    nullable: true,
  })
  porEstado: EstadoPorCantidad[] | null;

  @ApiProperty({
    description: 'Promedio de alertas por día en el rango',
    example: '4.11',
    nullable: true,
  })
  promedioPorDia: string | null;

  @ApiProperty({
    description: 'Filtros aplicados',
    type: FiltrosAlertasAplicados,
  })
  filtros: FiltrosAlertasAplicados;
}

export class EstadisticaUsuariosRegistrados {
  @ApiProperty({ description: 'Total de usuarios', example: 250 })
  total: number;

  @ApiProperty({ description: 'Usuarios activos', example: 230 })
  activos: number;

  @ApiProperty({ description: 'Usuarios inactivos', example: 20 })
  inactivos: number;

  @ApiProperty({ description: 'Usuarios validados', example: 200 })
  validados: number;

  @ApiProperty({ description: 'Usuarios no validados', example: 50 })
  noValidados: number;

  @ApiProperty({
    description: 'Usuarios registrados en los últimos 30 días',
    example: 15,
  })
  registradosUltimos30Dias: number;

  @ApiProperty({
    description: 'Usuarios por género',
    type: [GeneroPorCantidad],
  })
  porGenero: GeneroPorCantidad[];
}
