import { IsString, IsOptional, IsArray } from "class-validator";

export class PatchContactDto {
  @IsOptional()
  @IsString()
  remoteid?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsOptional()
  @IsArray()
  tags?: number[];
}
