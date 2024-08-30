import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsObject,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

// Define um DTO para cada mensagem individual
class MessageDto {
  @IsString()
  to!: string;

  @IsNumber()
  timeToSend!: number;
}

export class SendMessageMassiveRespDto {
  @IsString()
  content!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages!: MessageDto[];
}
