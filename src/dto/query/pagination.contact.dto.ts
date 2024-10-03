import { IsNumber, Min, Max, IsString, IsOptional } from "class-validator";
import { PaginationDto } from "./pagination.dto";


export class PaginationContactQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    remoteid?: string;
  
    @IsOptional()
    @IsNumber()
    tag?: number;
  
    @IsOptional()
    @IsNumber()
    id?: number;
  }