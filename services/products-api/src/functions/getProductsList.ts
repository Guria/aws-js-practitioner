import { formatJSONResponse } from "@guria.dev/aws-js-practitioner-commons/middy";
import type { ProductsService } from "services/products";

export async function handler(productsService: ProductsService) {
  return formatJSONResponse(await productsService.getAvailableProducts());
}
