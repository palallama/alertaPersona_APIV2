import { IsEmail, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearInvitacionDto {
  @ApiProperty({ 
    description: 'ID del usuario que envía la invitación',
    example: 1 
  })
  @IsInt()
  usuarioId: number;

  @ApiProperty({ 
    description: 'Email del usuario a invitar',
    example: 'amigo@example.com'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono del usuario a invitar (para implementación futura)',
    example: '+5491123456789'
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ 
    description: 'Mensaje personalizado para la invitación',
    example: '¡Únete a AlertaPersona para estar en contacto!'
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mensaje?: string;
}
