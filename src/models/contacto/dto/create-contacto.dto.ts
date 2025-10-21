import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactoDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario que quiere agregar el contacto',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: 2,
    description: 'ID del usuario que será solicitado como contacto',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  contactoId: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Si se notifica a este contacto una vez aceptado (por defecto true)',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
