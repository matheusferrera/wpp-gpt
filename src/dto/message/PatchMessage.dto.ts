import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsDateString,
  MaxLength,
  Min,
  IsNotEmpty,
} from "class-validator";

enum ContentType {
  text = "text",
  image = "image",
  video = "video",
}

enum MessageStatus {
  await = "await",
  send = "send",
  error = "error",
}

export class PatchMessageDto {
  @IsInt()
  id!: number;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @IsOptional()
  to?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsEnum(ContentType)
  @IsOptional()
  contentType?: ContentType;

  @IsEnum(MessageStatus)
  @IsOptional()
  status?: MessageStatus;
}
