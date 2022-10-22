import { provideProductsService } from "libs/provideProductsService";
import { handler } from "../functions/getProductById";

export const main = provideProductsService(handler);
