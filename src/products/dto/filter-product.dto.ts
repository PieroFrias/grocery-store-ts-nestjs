import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { OrderBy, OrderType } from '../enums/order.enum'
import { PaginationDto } from '../../commom/dtos/pagination.dto'

export class FilterProductDto extends PaginationDto {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  category_id?: number

  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  @IsEnum(OrderBy)
  order_by?: OrderBy

  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  @IsEnum(OrderType)
  order_type?: OrderType
}
