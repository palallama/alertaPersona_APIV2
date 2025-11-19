import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponderSolicitudContactoDto {
  @ApiProperty({
    example: 'A',
    description: 'Respuesta a la solicitud de contacto',
    enum: ['A', 'R'],
  })
  @IsNotEmpty()
  @IsIn(['A', 'R'], { 
    message: 'El estado debe ser A (Aceptado) o R (Rechazado)' 
  })
  estado: 'A' | 'R';
}