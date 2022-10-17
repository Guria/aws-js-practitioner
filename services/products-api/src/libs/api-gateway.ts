import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import middyCors from "@middy/http-cors";
import type { APIGatewayProxyHandler } from "aws-lambda";

export const middyfy = <H extends APIGatewayProxyHandler>(handler: H) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(middyCors({ origin: "*" }));
};

export const formatJSONResponse = (response: unknown) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
