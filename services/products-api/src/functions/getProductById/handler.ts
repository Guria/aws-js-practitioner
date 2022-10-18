import type { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse, middyfy } from "@libs/api-gateway";
import { products } from "@guria.dev/aws-js-practitioner-commons/mocks";
import { ProductsService } from "@services/products";
import { createError } from "@middy/util";

const productsService = new ProductsService(products);

const handler: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters;
  const product = await productsService.getProductById(productId);
  if (!product) {
    throw createError(404, JSON.stringify({ message: "Product not found" }));
  }

  return formatJSONResponse(await productsService.getProductById(productId));
};

export const main = middyfy(handler);
