import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { PaginationDto } from '../../commom/dtos/pagination.dto'

export class FilterCategoryDto extends PaginationDto {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string
}
