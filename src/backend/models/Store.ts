import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  location: string;

  @Column({ length: 100, nullable: true })
  managerName?: string;

  @Column({ length: 20, nullable: true })
  contactNumber?: string;

  @Column({ length: 20, default: 'open' })
  status: string; // 'open' | 'closed' | 'maintenance'

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSales: number;

  @Column({ default: 0 })
  ordersCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
