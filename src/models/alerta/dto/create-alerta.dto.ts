import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlertaDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario que genera la alerta',
  })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: -34.6037,
    description: 'Latitud geográfica de la alerta',
  })
  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @ApiProperty({
    example: -58.3816,
    description: 'Longitud geográfica de la alerta',
  })
  @IsNumber()
  @IsNotEmpty()
  longitud: number;

  @ApiPropertyOptional({
    example: 'pendiente',
    description: 'Estado actual de la alerta (opcional)',
  })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59Z',
    description: 'Fecha de cierre de la alerta (opcional, en formato ISO)',
  })
  @IsDateString()
  @IsOptional()
  fchCierre?: Date;

  @ApiPropertyOptional({
    example: false,
    description: 'Indica si la alerta ya está cerrada (opcional)',
  })
  @IsBoolean()
  @IsOptional()
  cerrada?: boolean;
}
