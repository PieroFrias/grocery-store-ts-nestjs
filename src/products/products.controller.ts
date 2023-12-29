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
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { FilterProductDto } from './dto/filter-product.dto'

@Controller('products')
export class ProductsController {
  constructor (private readonly productsService: ProductsService) {}

  @Post()
  async create (@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto)
  }

  @Get()
  async findAll () {
    return await this.productsService.findAll()
  }

  @Get('paginated')
  async findAllPaginated (@Query() filterProductDto: FilterProductDto) {
    return await this.productsService.findAllPaginated(filterProductDto)
  }

  @Get(':id')
  async findOne (@Param('id') id: number) {
    return await this.productsService.findOne(id)
  }

  @Patch(':id')
  async update (
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')
  async remove (@Param('id') id: number) {
    return await this.productsService.remove(id)
  }
}
