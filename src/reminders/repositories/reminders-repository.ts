import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reminder } from "../entities/reminder.entity";
import { IsNull, LessThanOrEqual, Repository } from "typeorm";

@Injectable()
export class RemindersRepository {
  constructor(
    @InjectRepository(Reminder)
    public remindersRepository: Repository<Reminder>,
  ) {}

  public async save(reminder: Partial<Reminder>): Promise<Reminder> {
    return await this.remindersRepository.save(reminder);
  }

  public async getUnsentReminders() {
    return await this.remindersRepository.find({
      where: {
        sent_at: IsNull(),
        failed_at: IsNull(),
        time: LessThanOrEqual(new Date().toISOString()),
      },
    });
  }

  public async updateMany(reminders: Reminder[]): Promise<Reminder[]> {
    return await this.remindersRepository.save(reminders);
  }
}
