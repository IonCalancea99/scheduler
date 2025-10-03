import { DataSource } from "typeorm";

export default new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
});
