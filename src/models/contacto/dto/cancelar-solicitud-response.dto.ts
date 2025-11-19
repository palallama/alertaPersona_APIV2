import { ApiProperty } from '@nestjs/swagger';

class ContactoInfoDto {
  @ApiProperty({
    example: 2,
    description: 'ID del usuario contacto',
  })
  id: number;

  @ApiProperty({
    example: 'María',
    description: 'Nombre del usuario contacto',
  })
  nombre: string;

  @ApiProperty({
    example: 'González',
    description: 'Apellido del usuario contacto',
  })
  apellido: string;

  @ApiProperty({
    example: 'maria@example.com',
    description: 'Email del usuario contacto',
  })
  mail: string;
}

class SolicitudCanceladaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la solicitud cancelada',
  })
  id: number;

  @ApiProperty({
    description: 'Información del contacto al que se envió la solicitud',
    type: ContactoInfoDto,
  })
  contacto: ContactoInfoDto;
}

export class CancelarSolicitudResponseDto {
  @ApiProperty({
    example: 'Solicitud de contacto a María González cancelada exitosamente',
    description: 'Mensaje de confirmación de cancelación',
  })
  message: string;

  @ApiProperty({
    description: 'Información de la solicitud cancelada',
    type: SolicitudCanceladaDto,
  })
  solicitudCancelada: SolicitudCanceladaDto;
}