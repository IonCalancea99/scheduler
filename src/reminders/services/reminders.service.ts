import { Injectable } from "@nestjs/common";
import { ChannelType, CreateReminderDto } from "../dto/CreateReminderDto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RemindersRepository } from "../repositories/reminders-repository";
import { Reminder } from "../entities/reminder.entity";
import { MailService } from "../../mail/services/mail.service";

@Injectable()
export class RemindersService {
  constructor(
    private remindersRepo: RemindersRepository,
    private mailService: MailService,
  ) {}

  public async scheduleReminder(reminder: CreateReminderDto): Promise<void> {
    await this.remindersRepo.save(reminder);
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async handleReminders(): Promise<void> {
    const reminders = await this.remindersRepo.getUnsentReminders();
    const databaseReminders = reminders.filter(
      (r) => (r.channel as ChannelType) === ChannelType.DATABASE,
    );
    const emailReminders = reminders.filter(
      (r) => (r.channel as ChannelType) === ChannelType.MAIL,
    );
    console.log("Handling reminders:", reminders.length);
    await this.databaseRemindersHandler(databaseReminders);
    console.log("Database reminders handled:", databaseReminders.length);
    await this.emailRemindersHandler(emailReminders);
    console.log("Email reminders handled:", emailReminders.length);
  }

  private async emailRemindersHandler(reminders: Reminder[]) {
    await Promise.all(
      reminders.map((reminder) => {
        return this.mailService
          .sendTextEmail(
            reminder.email as string,
            "Reminder Notification",
            reminder.message,
          )
          .then(() => {
            console.log("Email reminder sent to:", reminder.email);
            reminder.sent_at = new Date().toISOString();
            return reminder;
          })
          .catch(() => {
            console.log("Failed to send email to:", reminder.email);
            reminder.failed_at = new Date().toISOString();
            reminder.sent_at = new Date().toISOString();
            return reminder;
          });
      }),
    );

    if (reminders.length > 0) {
      await this.remindersRepo.updateMany(reminders);
    }
  }

  private async databaseRemindersHandler(reminders: Reminder[]) {
    for (const reminder of reminders) {
      try {
        reminder.sent_at = new Date().toISOString();
        console.log(`Database Notification: ${reminder.message}`);
      } catch (_) {
        reminder.failed_at = new Date().toISOString();
      }
    }

    if (reminders.length > 0) {
      await this.remindersRepo.updateMany(reminders);
    }
  }
}
