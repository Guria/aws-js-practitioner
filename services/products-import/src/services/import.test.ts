import { describe, test, expect, vi } from "vitest";
import { ImportService } from "./import";
import { createReadStream } from "fs";
import { join } from "path";
import { ImportProvider } from "./importProvider";

function usePartial<T>(obj: Partial<T>): T {
  return obj as T;
}

describe("getSignedUrl", () => {
  test("should add timestamp suffix to filename", async () => {
    const importService = new ImportService({
      importProvider: usePartial<ImportProvider>({
        getSignedUrl: async (name: string) => name,
      }),
    });

    const url = await importService.getSignedUrl("test.csv");

    expect(url).toMatch(/\.\d+\.csv$/);
  });
});

describe("importProductsFile", () => {
  test("should parse csv file", async () => {
    const moveFileSpy = vi.fn();
    const logSpy = vi.fn();
    const importService = new ImportService({
      importProvider: usePartial<ImportProvider>({
        getReadStream: () => {
          return createReadStream(join(__dirname, "./products.csv"));
        },
        moveFile: moveFileSpy,
      }),
      logger: usePartial<Console>({
        log: logSpy,
        debug: vi.fn(),
        error: vi.fn(),
      }),
    });

    await importService.importProductsFile("uploaded/test.csv");
    // TODO: expect price and count to be numbers
    expect(logSpy).toHaveBeenNthCalledWith(1, {
      title: "test",
      description: "description",
      price: "10",
      count: "2",
    });
    expect(logSpy).toHaveBeenNthCalledWith(2, {
      title: "test2",
      description: "description2",
      price: "20",
      count: "3",
    });
    expect(moveFileSpy).toHaveBeenCalledWith(
      "uploaded/test.csv",
      "parsed/test.csv"
    );
  });
});
