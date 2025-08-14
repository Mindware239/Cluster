import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create stores table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "stores" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "location" varchar(255) NOT NULL,
        "manager_name" varchar(100),
        "contact_number" varchar(20),
        "status" varchar(20) DEFAULT 'open',
        "total_sales" decimal(10,2) DEFAULT 0,
        "orders_count" integer DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create inventory table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "store_id" uuid REFERENCES "stores"("id") ON DELETE CASCADE,
        "product_name" varchar(255) NOT NULL,
        "sku" varchar(50) UNIQUE NOT NULL,
        "quantity" integer NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "status" varchar(20) DEFAULT 'available',
        "low_stock_threshold" integer DEFAULT 10,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create sales table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sales" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "store_id" uuid REFERENCES "stores"("id") ON DELETE CASCADE,
        "date" date NOT NULL,
        "total_sales" decimal(10,2) NOT NULL,
        "orders_count" integer NOT NULL,
        "payment_cash" decimal(10,2) DEFAULT 0,
        "payment_card" decimal(10,2) DEFAULT 0,
        "payment_upi" decimal(10,2) DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create staff table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "staff" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "store_id" uuid REFERENCES "stores"("id") ON DELETE CASCADE,
        "name" varchar(100) NOT NULL,
        "role" varchar(50) NOT NULL,
        "sales_count" integer DEFAULT 0,
        "attendance_days" integer DEFAULT 0,
        "status" varchar(20) DEFAULT 'active',
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create promotions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "promotions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "store_id" uuid REFERENCES "stores"("id") ON DELETE CASCADE,
        "title" varchar(255) NOT NULL,
        "discount_percent" integer NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "status" varchar(20) DEFAULT 'active',
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create alerts table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "alerts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "store_id" uuid REFERENCES "stores"("id") ON DELETE CASCADE,
        "message" text NOT NULL,
        "alert_type" varchar(50) NOT NULL,
        "status" varchar(20) DEFAULT 'unread',
        "is_urgent" boolean DEFAULT false,
        "created_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create basic users and roles tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar UNIQUE NOT NULL,
        "password_hash" varchar NOT NULL,
        "first_name" varchar,
        "last_name" varchar,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" varchar,
        "created_at" TIMESTAMP DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "alerts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "promotions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "staff"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stores"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
