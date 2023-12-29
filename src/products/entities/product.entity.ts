import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { BaseEntity } from "../../commom/entities/base.entity";
import { Category } from "../../categories/entities/category.entity"

@Entity('products')
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  retail_price: number

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  wholesale_price: number

  @Column({ type: 'text', nullable: true })
  additional_info: string

  @Column({ nullable: true })
  image: string
  
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category
}
