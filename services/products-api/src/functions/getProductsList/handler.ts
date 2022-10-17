import type { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse, middyfy } from "@libs/api-gateway";
import productsService from "@services/products";

const handler: APIGatewayProxyHandler = async () => {
  return formatJSONResponse(await productsService.getProducts());
};

export const main = middyfy(handler);