import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  storeId: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 50 })
  alertType: string; // 'stockLow' | 'posOffline' | 'maintenance' | 'custom'

  @Column({ length: 20, default: 'unread' })
  status: string; // 'unread' | 'read' | 'resolved'

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
