import { describe, test, expect } from "vitest";
import { ImportService } from "./import";

describe("importProductsFile", () => {
  test("should return signed url", async () => {
    const importService = new ImportService({
      getSignedUrl: async () => "signed-url",
    } as any);

    const url = await importService.getSignedUrl("test.csv");

    expect(url).toBe("signed-url");
  });

  test("should add timestamp suffix to filename", async () => {
    const importService = new ImportService({
      getSignedUrl: async (name: string) => name,
    } as any);

    const url = await importService.getSignedUrl("test.csv");

    expect(url).toMatch(/\.\d+\.csv$/);
  });
});
