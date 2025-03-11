import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductQueryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number;
}
