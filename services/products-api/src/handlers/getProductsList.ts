import { provideProductsService } from "services/provideProductsService";
import { handler } from "../functions/getProductsList";

export const main = provideProductsService(handler);
