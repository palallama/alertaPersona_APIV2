import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioAdicionalDto } from './create-usuario-adicional.dto';

export class UpdateUsuarioAdicionalDto extends PartialType(CreateUsuarioAdicionalDto) {}
