import { Test, TestingModule } from '@nestjs/testing';
import { RemindersRepository } from './reminders-repository';

describe('ReminderRepositoryService', () => {
  let service: RemindersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemindersRepository],
    }).compile();

    service = module.get<RemindersRepository>(RemindersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
