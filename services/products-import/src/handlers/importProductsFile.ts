import { provideImportService } from "services/provideImportService";
import { handler } from "functions/importProductsFile";

export const main = provideImportService(handler);
