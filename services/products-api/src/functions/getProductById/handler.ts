import type { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse, middyfy } from "@libs/api-gateway";
import productsService from "@services/products";

const handler: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters;
  return formatJSONResponse(await productsService.getProductById(productId));
};

export const main = middyfy(handler);
