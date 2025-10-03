import { Test, TestingModule } from "@nestjs/testing";
import { RemindersService } from "./reminders.service";
import { RemindersRepository } from "../repositories/reminders-repository";
import { MailService } from "../../mail/services/mail.service";
import { ChannelType } from "../dto/CreateReminderDto";

describe("RemindersService", () => {
  let service: RemindersService;
  let remindersRepo: RemindersRepository;
  let mailService: MailService;

  beforeEach(async () => {
    const remindersRepoMock = {
      save: jest.fn(),
      getUnsentReminders: jest.fn(),
      updateMany: jest.fn(),
    };
    const mailServiceMock = {
      sendTextEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemindersService,
        { provide: RemindersRepository, useValue: remindersRepoMock },
        { provide: MailService, useValue: mailServiceMock },
      ],
    }).compile();

    service = module.get<RemindersService>(RemindersService);
    remindersRepo = module.get<RemindersRepository>(RemindersRepository);
    mailService = module.get<MailService>(MailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call save on scheduleReminder", async () => {
    const reminderDto = { message: "Test", channel: ChannelType.DATABASE };
    await service.scheduleReminder(reminderDto as any);
    expect(remindersRepo.save).toHaveBeenCalledWith(reminderDto);
  });

  it("should handle reminders and call handlers", async () => {
    const reminders = [
      { channel: ChannelType.DATABASE, message: "db", email: null },
      { channel: ChannelType.MAIL, message: "mail", email: "test@test.com" },
    ];
    remindersRepo.getUnsentReminders.mockResolvedValue(reminders);
    jest.spyOn(service as any, "databaseRemindersHandler").mockResolvedValue(undefined);
    jest.spyOn(service as any, "emailRemindersHandler").mockResolvedValue(undefined);

    await service.handleReminders();

    expect(remindersRepo.getUnsentReminders).toHaveBeenCalled();
    expect((service as any).databaseRemindersHandler).toHaveBeenCalledWith([reminders[0]]);
    expect((service as any).emailRemindersHandler).toHaveBeenCalledWith([reminders[1]]);
  });

  it("should send emails and update reminders in emailRemindersHandler", async () => {
    const reminders = [
      { email: "a@b.com", message: "msg", channel: ChannelType.MAIL },
    ];
    mailService.sendTextEmail.mockResolvedValue(undefined);
    remindersRepo.updateMany.mockResolvedValue(undefined);

    await (service as any).emailRemindersHandler(reminders);

    expect(mailService.sendTextEmail).toHaveBeenCalledWith(
      "a@b.com",
      "Reminder Notification",
      "msg"
    );
    expect(reminders[0].sent_at).toBeDefined();
    expect(remindersRepo.updateMany).toHaveBeenCalledWith(reminders);
  });

  it("should update reminders in databaseRemindersHandler", async () => {
    const reminders = [
      { message: "db", channel: ChannelType.DATABASE },
    ];
    remindersRepo.updateMany.mockResolvedValue(undefined);

    await (service as any).databaseRemindersHandler(reminders);

    expect(reminders[0].sent_at).toBeDefined();
    expect(remindersRepo.updateMany).toHaveBeenCalledWith(reminders);
  });

  it("should process reminders in cron job", async () => {
    const reminders = [
      { channel: ChannelType.DATABASE, message: "db", email: null },
      { channel: ChannelType.MAIL, message: "mail", email: "test@test.com" },
    ];
    remindersRepo.getUnsentReminders.mockResolvedValue(reminders);
    mailService.sendTextEmail.mockResolvedValue(undefined);
    remindersRepo.updateMany.mockResolvedValue(undefined);

    await service.handleReminders();

    // Database reminder should be updated
    expect(reminders[0].sent_at).toBeDefined();
    // Email reminder should be sent and updated
    expect(mailService.sendTextEmail).toHaveBeenCalledWith(
      "test@test.com",
      "Reminder Notification",
      "mail"
    );
    expect(reminders[1].sent_at).toBeDefined();
    // Both reminders should be updated in the repo
    expect(remindersRepo.updateMany).toHaveBeenCalledWith([reminders[0]]);
    expect(remindersRepo.updateMany).toHaveBeenCalledWith([reminders[1]]);
  });
});
