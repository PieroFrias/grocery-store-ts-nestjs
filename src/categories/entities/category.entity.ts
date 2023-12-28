import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../commom/entities/base.entity";

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string
}
