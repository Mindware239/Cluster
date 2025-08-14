import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleTenantColumns1700000000002 implements MigrationInterface {
  name = 'AddUserRoleTenantColumns1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add tenant_id column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'tenant_id'
        ) THEN
          ALTER TABLE users ADD COLUMN tenant_id UUID;
        END IF;
      END $$;
    `);

    // Add role_id column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'role_id'
        ) THEN
          ALTER TABLE users ADD COLUMN role_id UUID;
        END IF;
      END $$;
    `);

    // Add code column to roles table if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'roles' AND column_name = 'code'
        ) THEN
          ALTER TABLE roles ADD COLUMN code VARCHAR UNIQUE DEFAULT 'user';
        END IF;
      END $$;
    `);

    // Create audit_logs table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id VARCHAR(100),
        details JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        ip_address VARCHAR(45),
        user_agent TEXT,
        duration INTEGER,
        error TEXT,
        user_id UUID,
        tenant_id UUID,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_users_tenant_id'
        ) THEN
          ALTER TABLE users ADD CONSTRAINT FK_users_tenant_id 
          FOREIGN KEY (tenant_id) REFERENCES tenants(id);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_users_role_id'
        ) THEN
          ALTER TABLE users ADD CONSTRAINT FK_users_role_id 
          FOREIGN KEY (role_id) REFERENCES roles(id);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_audit_logs_user_id'
        ) THEN
          ALTER TABLE audit_logs ADD CONSTRAINT FK_audit_logs_user_id 
          FOREIGN KEY (user_id) REFERENCES users(id);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_audit_logs_tenant_id'
        ) THEN
          ALTER TABLE audit_logs ADD CONSTRAINT FK_audit_logs_tenant_id 
          FOREIGN KEY (tenant_id) REFERENCES tenants(id);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraints
    await queryRunner.query(`
      ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS FK_audit_logs_tenant_id;
      ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS FK_audit_logs_user_id;
      ALTER TABLE users DROP CONSTRAINT IF EXISTS FK_users_role_id;
      ALTER TABLE users DROP CONSTRAINT IF EXISTS FK_users_tenant_id;
    `);

    // Drop audit_logs table
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs;`);

    // Remove columns
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS role_id;
      ALTER TABLE users DROP COLUMN IF EXISTS tenant_id;
      ALTER TABLE roles DROP COLUMN IF EXISTS code;
    `);
  }
}
