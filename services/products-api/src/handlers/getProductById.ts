import { provideProductsService } from "services/provideProductsService";
import { handler } from "../functions/getProductById";

export const main = provideProductsService(handler);
