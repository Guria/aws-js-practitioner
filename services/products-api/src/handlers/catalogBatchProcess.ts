import { provideProductsServiceSQS } from "services/provideProductsService";
import { handler } from "../functions/catalogBatchProcess";

export const main = provideProductsServiceSQS(handler);
