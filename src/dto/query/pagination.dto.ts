import { IsNumber, Min, Max, IsString, IsOptional } from "class-validator";

export class PaginationDto {
  @IsString()
  page: string = "1";

  @IsString()
  pageSize: string = "10"; // Número de itens por página

}
