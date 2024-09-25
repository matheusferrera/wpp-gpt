import { IsString, IsOptional, IsArray } from "class-validator";

export class CreateContactDto {
  @IsString()
  remoteid!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsOptional()
  @IsArray()
  tags?: number[];
}
