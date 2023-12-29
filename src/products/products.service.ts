import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { PaginatedResponse } from '../commom/interfaces/paginated-response.interface';
import { handleDBExceptions } from '../commom/functions/handleDBExceptions';

@Injectable()
export class ProductsService {
  constructor (
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService
  ) {}

  async create (createProductDto: CreateProductDto): Promise<{ product: Product, message: string }> {
    const { name, category_id } = createProductDto

    const category = await this.categoriesService.findOne(category_id)
    await this.productExists(name)

    
    try {
      const newProduct = this.productsRepository.create({
        ...createProductDto,
        category,
      })

      const product = await this.productsRepository.save(newProduct)

      return {
        product,
        message: 'Product created successfully',
      }
    } catch (error) {
      handleDBExceptions(error)
    }
  }

  async findAll (): Promise<{ products: Product[], total: number }> {
    const products = await this.productsRepository.find({
      relations: ['category'],
      order: { id: 'DESC' }
    })

    if (products.length === 0) throw new NotFoundException('No products found')

    const data = this.formatProducts(products)

    return { products: data, total: products.length }
  }

  async findAllPaginated (
    filterProductDto: FilterProductDto
  ): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      pageSize = 10,
      name,
      category_id,
      order_by,
      order_type,
    } = filterProductDto

    const offset = (page - 1) * pageSize

    const where = this.getWhereCondition(name, category_id)
    const order = this.getOrder(order_by, order_type)

    const [products, totalItems] = await this.productsRepository.findAndCount({
      where,
      relations: ['category'],
      order,
      skip: offset,
      take: pageSize,
    })

    if (products.length === 0) throw new NotFoundException('No products found')

    const data = this.formatProducts(products)
    const totalPages = Math.ceil(totalItems / pageSize)

    return { data, currentPage: page, totalPages, totalItems }
  }

  async findOne (id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    })

    if (!product) throw new NotFoundException(`Product with id '${id}' not found`)

    return {
      ...product,
      retail_price: Number(product.retail_price),
      wholesale_price: Number(product.wholesale_price),
    }
  }

  async update (id: number, updateProductDto: UpdateProductDto): Promise<{ product: Product, message: string }> {
    const productFound = await this.findOne(id)
    const { category_id } = updateProductDto

    if (category_id && category_id !== productFound.category.id) {
      const category = await this.categoriesService.findOne(category_id)
      productFound.category = category
    }

    try {
      const updatedProduct = this.productsRepository.merge(
        productFound,
        updateProductDto
      )

      const product = await this.productsRepository.save(updatedProduct)

      return {
        product,
        message: 'Product updated successfully',
      }
    } catch (error) {
      handleDBExceptions(error)
    }
  }

  async remove (id: number) {
    await this.findOne(id)

    await this.productsRepository.delete(id)

    return { message: 'Product deleted successfully' }
  }

  private formatProducts (products: Product[]) {
    return products.map(product => ({
      ...product,
      retail_price: Number(product.retail_price),
      wholesale_price: Number(product.wholesale_price),
    }))
  }

  private getWhereCondition (name?: string, category_id?: number) {
    const where = {}

    if (name) where['name'] = Like(`%${name}%`)
    if (category_id) where['category.id'] = category_id

    return where
  }

  private getOrder (orderBy?: string, orderType?: string) {
    if (orderBy && orderType) {
      const order = { [orderBy]: orderType }
      return order
    }
  
    return { id: 'DESC' }
  }
  
  private async productExists (name: string) {
    const product = await this.productsRepository.findOneBy({ name })

    if (product) throw new ConflictException(`Duplicate entry '${name}'`)
  }
}
