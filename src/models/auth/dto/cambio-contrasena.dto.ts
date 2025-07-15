import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambioContrasenaDto {
  @ApiProperty({
    example: 'miContrasenaAnterior',
    description: 'Contraseña actual del usuario',
  })
  @IsString()
  @IsNotEmpty()
  contrasenaActual: string;

  @ApiProperty({
    example: 'nuevaContrasenaSegura123',
    description: 'Nueva contraseña (mínimo 8 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  nuevaContrasena: string;
}
