import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltroFechasDto {
  @ApiProperty({
    description: 'Fecha de inicio del rango (formato ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiProperty({
    description: 'Fecha de fin del rango (formato ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}

export class FiltroAlertasDto extends FiltroFechasDto {
  @ApiProperty({
    description: 'Estado de la alerta (E=Emitida, C=Cancelada, S=Solucionada, X=Expirada)',
    example: 'E',
    required: false,
    enum: ['E', 'C', 'S', 'X'],
  })
  @IsOptional()
  @IsIn(['E', 'C', 'S', 'X'])
  estado?: string;
}

export class FiltroAlertasPorUsuarioDto extends FiltroFechasDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
    type: Number,
  })
  @IsInt()
  @Type(() => Number)
  usuarioId: number;
}
