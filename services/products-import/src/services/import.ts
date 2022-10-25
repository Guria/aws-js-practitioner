import { ImportProvider } from "./importProvider";

export class ImportService {
  constructor(private readonly importProvider: ImportProvider) {}

  async getSignedUrl(name: string) {
    const fileName = `uploaded/${name.replace(/\.csv$/, "")}.${Date.now()}.csv`;

    return this.importProvider.getSignedUrl(fileName);
  }
}
