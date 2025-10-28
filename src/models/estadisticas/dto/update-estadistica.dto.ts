// Este archivo no se usa para estadísticas ya que son solo de lectura
import { PartialType } from '@nestjs/swagger';
import { FiltroFechasDto } from './create-estadistica.dto';

export class UpdateEstadisticaDto extends PartialType(FiltroFechasDto) {}
