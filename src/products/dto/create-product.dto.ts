import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateProductDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  name: string

  @IsInt()
  @IsPositive()
  category_id: number

  @IsNumber()
  @Min(0)
  retail_price: number

  @IsNumber()
  @Min(0)
  wholesale_price: number

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  additional_info?: string

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image?: string
}
