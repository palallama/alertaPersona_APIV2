import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificacionDto {
  @ApiProperty({
    example: 5,
    description: 'ID del usuario al que se le asigna la notificación',
  })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: false,
    description: 'Indica si la notificación ya fue leída',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  leida?: boolean;
}
