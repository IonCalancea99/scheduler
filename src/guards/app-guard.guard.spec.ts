import { AppGuard } from "./app-guard.service";

describe("AppGuardGuard", () => {
  it("should return true when X-SCHEDULER-HEADER is secret!", () => {
    const guard = new AppGuard();
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { "X-SCHEDULER-HEADER": "secret!" },
        }),
      }),
    };
    expect(guard.canActivate(context)).toBe(true);
  });

  it("should return false when X-SCHEDULER-HEADER is not secret!", () => {
    const guard = new AppGuard();
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { "X-SCHEDULER-HEADER": "wrong-value" },
        }),
      }),
    };
    expect(guard.canActivate(context)).toBe(false);
  });
});
