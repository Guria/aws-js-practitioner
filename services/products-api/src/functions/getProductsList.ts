import { formatJSONResponse } from "libs/format-response";
import type { ProductsService } from "services/products";

export async function handler(productsService: ProductsService) {
  return formatJSONResponse(await productsService.getAvailableProducts());
}
