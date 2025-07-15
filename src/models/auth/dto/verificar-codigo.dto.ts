// src/auth/dto/solicitar-codigo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class SolicitarCodigoDto {

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario que solicita recuperación',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerificarCodigoDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de 6 dígitos recibido por email',
    minLength: 6,
    maxLength: 6,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  codigo: string;
}

export class ResetearContrasenaDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de 6 dígitos recibido por email',
    minLength: 6,
    maxLength: 6,
    required: true
  })
  @IsString()
  @IsOptional()
  @Length(6, 6)
  codigo: string;

  @ApiProperty({
    example: 'NuevaContraseñaSegura123',
    description: 'Nueva contraseña del usuario',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  nuevaContrasena: string;
}