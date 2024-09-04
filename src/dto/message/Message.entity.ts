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
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

enum MessageStatus {
  AWAIT = "await",
  SENT = "sent",
  DELIVERED = "delivered",
  FAILED = "failed",
}

export class MessageDto {
  @IsInt()
  readonly id!: number;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt!: Date;

  @IsDate()
  @IsNotEmpty()
  readonly updatedAt!: Date;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  readonly to!: string;

  @IsOptional()
  @IsString()
  readonly content!: string;

  @IsEnum(ContentType)
  readonly contentType!: ContentType;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  readonly timeToSend!: number;

  @IsEnum(MessageStatus)
  readonly status!: MessageStatus;
}
