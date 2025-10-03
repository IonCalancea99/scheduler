import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1759487694103 implements MigrationInterface {
  name = "Migration1759487694103";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reminders" ("id" varchar PRIMARY KEY NOT NULL, "channel" varchar(10) NOT NULL, "message" varchar(256) NOT NULL, "time" datetime NOT NULL DEFAULT (1759487695608), "email" varchar(50), "sent_at" datetime, "failed_at" datetime)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reminders"`);
  }
}
