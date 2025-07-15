import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAsistenteDto {
  @ApiProperty({
    example: 101,
    description: 'ID de la alerta a la que se asocia el asistente',
  })
  @IsNumber()
  @IsNotEmpty()
  alertaId: number;

  @ApiProperty({
    example: 202,
    description: 'ID del usuario que actuará como asistente',
  })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: 'asignado',
    description: 'Estado del asistente (por ejemplo: asignado, en camino, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiPropertyOptional({
    example: 'El asistente fue asignado manualmente.',
    description: 'Observaciones adicionales (opcional)',
  })
  @IsString()
  @IsOptional()
  observacion: string;
}
