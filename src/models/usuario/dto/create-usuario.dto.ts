import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  IsOptional,
  IsBoolean,
  IsPositive,
  Length,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({
    example: 12345678,
    description: 'Número de documento del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8,8)
  nroDocumento: string;

  @ApiProperty({
    example: '123456789',
    description: 'Teléfono de contacto del usuario',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefono: string;

  @ApiProperty({
    example: '987654321',
    description: 'Número de trámite del documento',
    maxLength: 11,
  })
  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  nroTramite: string;

  @ApiProperty({
    example: 'M',
    description: 'Género del usuario (M o F)',
    maxLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  @Transform(({ value }) => value.toUpperCase())
  genero: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Fecha de nacimiento del usuario (YYYY-MM-DD)',
  })
  // @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  fchNacimiento: Date;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del usuario',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  mail: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el usuario fue validado (opcional)',
  })
  @IsBoolean()
  @IsOptional()
  validado?: boolean;
}
