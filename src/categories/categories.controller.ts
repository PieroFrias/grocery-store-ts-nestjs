import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { FilterCategoryDto } from './dto/filter-category.dto'

@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoriesService: CategoriesService) {}

  @Post()
  async create (@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  async findAll () {
    return await this.categoriesService.findAll()
  }

  @Get('paginated')
  async findAllPaginated (@Query() filterCategoryDto: FilterCategoryDto) {
    return await this.categoriesService.findAllPaginated(filterCategoryDto)
  }

  @Get(':id')
  async findOne (@Param('id') id: number) {
    return await this.categoriesService.findOne(id)
  }

  @Patch(':id')
  async update (
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  async remove (@Param('id') id: number) {
    return await this.categoriesService.remove(id)
  }
}
