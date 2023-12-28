import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  name: string
}
