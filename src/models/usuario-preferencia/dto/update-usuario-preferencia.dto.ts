import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioPreferenciaDto } from './create-usuario-preferencia.dto';

export class UpdateUsuarioPreferenciaDto extends PartialType(CreateUsuarioPreferenciaDto) {}
