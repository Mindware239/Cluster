import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  storeId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalSales: number;

  @Column({ type: 'int' })
  ordersCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paymentCash: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paymentCard: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paymentUpi: number;

  @CreateDateColumn()
  createdAt: Date;
}
