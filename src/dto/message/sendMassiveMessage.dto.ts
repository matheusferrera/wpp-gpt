import {
  IsString,
  IsOptional,
  Length,
  IsNumber,
  IsArray,
  Min,
  Max,
} from "class-validator";

export class SendMessageMassiveDto {
  @IsArray()
  @IsString({ each: true })
  remoteId!: string[];

  @IsString()
  message!: string;

  @IsNumber()
  @Min(1000000000) // Minimum 10-digit number
  @Max(9999999999) // Maximum 10-digit number
  timeToSend!: number;

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  mediaContent?: string;
}
