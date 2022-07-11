import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFKName1641497404892 implements MigrationInterface {
    name = "FixFKName1641497404892";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        
        ALTER TABLE "task" DROP CONSTRAINT "FK_user_id"
        
        `);

        await queryRunner.query(`

        ALTER TABLE "task" RENAME COLUMN "user_id" TO "userIdId"

        `);

        await queryRunner.query(`

        ALTER TABLE "task" ADD 
        CONSTRAINT "FK_29c593b244774c65824ae1df648" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_29c593b244774c65824ae1df648"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "userIdId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
