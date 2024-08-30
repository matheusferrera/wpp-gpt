import {
  IsString,
  IsOptional,
  Length,
  IsNumber,
  IsArray,
} from "class-validator";

export class SendMessageMassiveDto {
  @IsArray()
  @IsString({ each: true })
  remoteId!: string[];

  @IsString()
  message!: string;

  @IsNumber()
  timeToSend!: number;

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  mediaContent?: string;
}
