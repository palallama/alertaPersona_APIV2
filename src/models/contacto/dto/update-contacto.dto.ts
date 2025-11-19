import { PartialType } from '@nestjs/swagger';
import { CreateContactoDto } from './create-contacto.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactoDto extends PartialType(CreateContactoDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Si se notifica a este contacto o no',
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Marca el contacto como eliminado (soft delete)',
  })
  @IsBoolean()
  @IsOptional()
  eliminado?: boolean;
}
