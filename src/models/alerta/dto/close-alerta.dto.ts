import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertaDto } from './create-alerta.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CloseAlertaDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    @Length(1)
    estado: string;
}
