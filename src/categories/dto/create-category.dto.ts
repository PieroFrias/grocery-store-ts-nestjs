import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateCategoryDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  name: string
}
