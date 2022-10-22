import { provideProductsService } from "libs/provideProductsService";
import { handler } from "../functions/createProduct";

export const main = provideProductsService(handler);
