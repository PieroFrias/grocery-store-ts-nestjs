import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { Category } from './entities/category.entity';
import { PaginatedResponse } from '../commom/interfaces/paginated-response.interface';
import { handleDBExceptions } from '../commom/functions/handleDBExceptions';

@Injectable()
export class CategoriesService {
  constructor (
    @InjectRepository(Category)
    private readonly categoriesepository: Repository<Category>
  ) {}

  async create (createCategoryDto: CreateCategoryDto): Promise<{ category: Category, message: string }> {
    const { name } = createCategoryDto
    await this.categoryExists(name)

    try {
      const newCategory = this.categoriesepository.create(createCategoryDto)
      const category = await this.categoriesepository.save(newCategory)

      return {
        category,
        message: 'Category created successfully'
      }
    } catch (error) {
      handleDBExceptions(error)
    }
  }

  async findAll (): Promise<{ categories: Category[], total: number }> {
    const categories = await this.categoriesepository.find({
      order: { id: 'DESC' }
    })

    if (categories.length === 0) throw new NotFoundException('No categories found')

    return { categories, total: categories.length }
  }

  async findAllPaginated (
    filterCategoryDto: FilterCategoryDto
  ): Promise<PaginatedResponse<Category>> {
    const { page = 1, pageSize = 10, name } = filterCategoryDto

    const offset = (page - 1) * pageSize
    const where = {}

    if (name) where['name'] = Like(`%${name}%`)

    const [data, totalItems] = await this.categoriesepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: offset,
      take: pageSize,
    })

    if (data.length === 0) throw new NotFoundException('No categories found')

    const totalPages = Math.ceil(totalItems / pageSize)

    return { data, currentPage: page, totalPages, totalItems }
  }

  async findOne (id: number): Promise<Category> {
    const category = await this.categoriesepository.findOneBy({ id })

    if (!category)
      throw new NotFoundException(`Category with id '${id}' not found`)

    return category
  }

  async update (id: number, updateCategoryDto: UpdateCategoryDto): Promise<{ category: Category, message: string }> {
    const categoryFound = await this.findOne(id)

    try {
      const updatedCategory = this.categoriesepository.merge(categoryFound, updateCategoryDto)

      const category = await this.categoriesepository.save(updatedCategory)

      return {
        category,
        message: 'Category updated successfully'
      }
    } catch (error) {
      handleDBExceptions(error)
    }
  }

  async remove (id: number): Promise<{ message: string }> {
    await this.findOne(id)

    await this.hasProductsAssociated(id)

    await this.categoriesepository.delete(id)

    return { message: 'Category deleted successfully' }
  }

  private async categoryExists (name: string) {
    const category = await this.categoriesepository.findOneBy({ name })

    if (category) throw new ConflictException(`Duplicate entry '${name}'`)
  }

  private async hasProductsAssociated (id: number) {
    const categoryWithProducts = await this.categoriesepository.findOne({
      where: { id },
      relations: ['products']
    })

    const products = categoryWithProducts.products.length

    if (products > 0)
      throw new ConflictException('This category has products associated')
  }
}
