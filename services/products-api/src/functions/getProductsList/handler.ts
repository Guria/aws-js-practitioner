import { formatJSONResponse, middyfy } from "@libs/api-gateway";
import { products } from "@guria.dev/aws-js-practitioner-commons/mocks";
import type { APIGatewayProxyHandler } from "aws-lambda";

const handler: APIGatewayProxyHandler = async () => {
  return formatJSONResponse(await products);
};

export const main = middyfy(handler);
