import { Test, TestingModule } from "@nestjs/testing";
import { RemindersController } from "./reminters.controller";

describe("RemindersController", () => {
  let controller: RemindersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemindersController],
    }).compile();

    controller = module.get<RemindersController>(RemindersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
