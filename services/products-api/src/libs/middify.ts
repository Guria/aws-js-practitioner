import type { APIGatewayProxyHandler } from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import middyCors from "@middy/http-cors";
import middyErrorHandler from "@middy/http-error-handler";

type Env = {
  CORS_ORIGINS: string;
};

export const middyfy = <H extends APIGatewayProxyHandler>(
  handler: H,
  env: Env
) => {
  const CORS_ORIGINS_ARRAY = env.CORS_ORIGINS.split(",").map((origin) => {
    return `https://${origin}`;
  });

  return middy(handler)
    .use(middyJsonBodyParser())
    .use(middyCors({ origins: CORS_ORIGINS_ARRAY }))
    .use(
      middyErrorHandler({
        fallbackMessage: JSON.stringify({ message: "Internal server error" }),
      })
    );
};
