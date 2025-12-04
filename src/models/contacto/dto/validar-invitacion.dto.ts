import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidarInvitacionDto {
  @ApiProperty({ 
    description: 'Código único de invitación',
    example: 'user_eogxeqesx'
  })
  @IsString()
  codigo: string;
}
