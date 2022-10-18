import type { APIGatewayProxyHandler } from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import middyCors from "@middy/http-cors";
import middyErrorHandler from "@middy/http-error-handler";

export const middyfy = <H extends APIGatewayProxyHandler>(handler: H) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(middyCors({ origin: "*" }))
    .use(
      middyErrorHandler({
        fallbackMessage: JSON.stringify({ message: "Internal server error" }),
      })
    );
};

export const formatJSONResponse = (response: unknown) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
