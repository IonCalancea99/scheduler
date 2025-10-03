import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { RemindersModule } from "./reminders/reminders.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reminder } from "./reminders/entities/reminder.entity";
import { APP_GUARD } from "@nestjs/core";
import { AppGuard } from "./guards/app-guard.service";
import { ScheduleModule } from "@nestjs/schedule";
import { MailModule } from './mail/mail.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MailModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [Reminder],
      synchronize: false,
      migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
      migrationsRun: false,
      logging: true,
    }),
    ScheduleModule.forRoot(),
    RemindersModule,
    MailModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
  ],
})
export class AppModule {}
