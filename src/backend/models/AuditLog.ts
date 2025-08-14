import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Tenant } from './Tenant';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  resource: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  resourceId?: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @Column({ type: 'enum', enum: ['success', 'failure', 'pending'], default: 'pending' })
  status: 'success' | 'failure' | 'pending';

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'integer', nullable: true })
  duration?: number;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  tenantId?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant?: Tenant;
}
