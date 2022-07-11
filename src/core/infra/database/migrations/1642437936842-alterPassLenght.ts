import { MigrationInterface, QueryRunner } from "typeorm";

export class alterPassLenght1642437936842 implements MigrationInterface {
    name = "alterPassLenght1642437936842";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "pass" TYPE character varying(60)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "pass" TYPE character varying(50)`); // DÚVIDA AO MENTOR: como seria o down nesse caso? deixa o drop column?
    }
}
