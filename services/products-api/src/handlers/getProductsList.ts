import { provideProductsService } from "libs/provideProductsService";
import { handler } from "../functions/getProductsList";

export const main = provideProductsService(handler);
