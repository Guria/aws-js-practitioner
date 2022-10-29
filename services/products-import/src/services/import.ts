import csv from "csv-parser";
import { ImportProvider } from "./importProvider";

type Services = {
  importProvider: ImportProvider;
  logger?: Console;
};

export class ImportService {
  private readonly importProvider: ImportProvider;
  private readonly logger: Console;

  constructor(services: Services) {
    this.importProvider = services.importProvider;
    this.logger = services.logger || console;
  }

  async getSignedUrl(name: string) {
    const fileName = `uploaded/${name.replace(/\.csv$/, "")}.${Date.now()}.csv`;

    return this.importProvider.getSignedUrl(fileName);
  }

  async importProductsFile(name: string): Promise<void> {
    this.logger.debug("importProductsFile", name);
    return new Promise((resolve, reject) => {
      this.importProvider
        .getReadStream(name)
        .pipe(csv({ headers: ["title", "description", "price", "count"] }))
        .on("data", (data) => {
          // TODO: apply and reuse validation
          // and type conversion
          this.logger.log(data);
        })
        .on("end", async () => {
          this.logger.debug("file parsed");
          await this.importProvider.moveFile(
            name,
            name.replace("uploaded", "parsed")
          );
          this.logger.debug("file moved");
          resolve();
        })
        .on("error", (error) => {
          this.logger.error(error);
          reject(error);
        });
    });
  }
}
