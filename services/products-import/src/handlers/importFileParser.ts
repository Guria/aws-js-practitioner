import { provideImportServiceS3 } from "services/provideImportService";
import { handler } from "functions/importFileParser";

export const main = provideImportServiceS3(handler);
