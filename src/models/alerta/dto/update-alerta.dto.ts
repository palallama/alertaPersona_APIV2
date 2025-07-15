import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertaDto } from './create-alerta.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateAlertaDto extends PartialType(CreateAlertaDto) {
    @IsInt()
    @IsOptional()
    public id: number;
}
