import { provideProductsService } from "services/provideProductsService";
import { handler } from "../functions/createProduct";

export const main = provideProductsService(handler);
