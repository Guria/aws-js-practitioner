import { handler } from "functions/importProductsFile";
import { provideImportService } from "services/provideImportService";

export const main = provideImportService(handler);
