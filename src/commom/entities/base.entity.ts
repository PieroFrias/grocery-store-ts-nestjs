import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date
}
