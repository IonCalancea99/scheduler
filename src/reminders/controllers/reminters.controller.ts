import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { RemindersService } from "../services/reminders.service";
import { CreateReminderDto } from "../dto/CreateReminderDto";
import { ApiResponse } from "@nestjs/swagger";

@Controller("reminders")
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post("schedule")
  @ApiResponse({ status: 201, description: "Reminder scheduled successfully." })
  @ApiResponse({ status: 400, description: "Invalid input data." })
  async schedule(@Body(new ValidationPipe()) body: CreateReminderDto) {
    return await this.remindersService.scheduleReminder(body);
  }
}
