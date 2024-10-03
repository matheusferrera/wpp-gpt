import { IsString, IsOptional, IsArray, IsNumber } from "class-validator";

export class CreateContactDto {
  @IsString()
  remoteid!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsOptional()
  @IsNumber()
  tag?: number;
}
