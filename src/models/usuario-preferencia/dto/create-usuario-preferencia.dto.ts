import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUsuarioPreferenciaDto {
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  clave: string;
}