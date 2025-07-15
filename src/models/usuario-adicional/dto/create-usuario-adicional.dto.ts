import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioAdicionalDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario al que se le agregará un dato adicional',
  })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: 'direccion',
    description: 'Clave del dato adicional (ej. dirección, teléfono, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  clave: string;

  @ApiProperty({
    example: 'Calle falsa 123',
    description: 'Valor asociado a la clave (ej. dirección del usuario)',
  })
  @IsString()
  @IsNotEmpty()
  valor: string;
}
