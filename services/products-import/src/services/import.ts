import csv from "csv-parser";
import { ImportProvider } from "./importProvider";

type Services = {
  importProvider: ImportProvider;
};

export class ImportService {
  private readonly importProvider: ImportProvider;

  constructor(services: Services) {
    this.importProvider = services.importProvider;
  }

  async getSignedUrl(name: string) {
    const fileName = `uploaded/${name.replace(/\.csv$/, "")}.${Date.now()}.csv`;

    return this.importProvider.getSignedUrl(fileName);
  }

  async importProductsFile(name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.importProvider
        .getReadStream(name)
        .pipe(
          csv({
            headers: ["title", "description", "price", "count"],
            mapValues: ({ header, value }) =>
              ["price", "count"].includes(header) ? Number(value) : value,
          })
        )
        .on("data", async (data) => {
          this.importProvider.notifyProduct(data);
        })
        .on("end", async () => {
          await this.importProvider.moveFile(
            name,
            name.replace("uploaded", "parsed")
          );
          resolve();
        })
        .on("error", reject);
    });
  }
}
