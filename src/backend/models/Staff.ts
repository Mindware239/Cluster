import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  storeId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  role: string;

  @Column({ type: 'int', default: 0 })
  salesCount: number;

  @Column({ type: 'int', default: 0 })
  attendanceDays: number;

  @Column({ length: 20, default: 'active' })
  status: string; // 'active' | 'inactive' | 'terminated'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
