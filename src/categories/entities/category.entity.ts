import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../commom/entities/base.entity";
import { Product } from "../../products/entities/product.entity";

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
}
