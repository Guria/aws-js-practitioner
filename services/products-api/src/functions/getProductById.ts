import { createError } from "@middy/util";
import { formatJSONResponse } from "libs/formatResponse";
import type { APIGatewayProxyEvent } from "aws-lambda";
import type { ProductsService } from "services/products";

export async function handler(
  productsService: ProductsService,
  event: APIGatewayProxyEvent
) {
  const { productId } = event.pathParameters;
  const product = await productsService.getProductById(productId);
  if (!product) {
    throw createError(404, JSON.stringify({ message: "Product not found" }));
  }

  return formatJSONResponse(await productsService.getProductById(productId));
}
