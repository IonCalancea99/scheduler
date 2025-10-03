import { Module } from "@nestjs/common";
import { RemindersController } from "./controllers/reminters.controller";
import { RemindersService } from "./services/reminders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reminder } from "./entities/reminder.entity";
import { RemindersRepository } from "./repositories/reminders-repository";
import { MailService } from "../mail/services/mail.service";

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  controllers: [RemindersController],
  providers: [RemindersService, RemindersRepository, MailService],
})
export class RemindersModule {}
