import { IsString, IsOptional, Length } from "class-validator";

export class SendMessageDto {
  @IsString()
  remoteId!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  mediaContent?: string;
}
