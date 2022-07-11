import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserAndCreateTableTask1641402866958 implements MigrationInterface {
    name = "CreateTableUserAndCreateTableTask1641402866958";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

        CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "name" character varying(50) NOT NULL, 
            "pass" character varying(50) NOT NULL, 
            CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
            
            `);

        await queryRunner.query(`
        
        CREATE TABLE "task" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "description" character varying(50) NOT NULL, 
            "detail" character varying NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "user_id" uuid, 
            CONSTRAINT "PK_task_id" PRIMARY KEY ("id")
            )
            
            `);

        await queryRunner.query(`
        
        ALTER TABLE "task" ADD 
        CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_29c593b244774c65824ae1df648"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
