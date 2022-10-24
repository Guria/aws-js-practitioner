import type { APIGatewayProxyHandler } from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import middyCors from "@middy/http-cors";
import middyErrorHandler from "@middy/http-error-handler";
import middyAccessLog from "@schibsted/middy-access-log";

type Env = {
  CORS_ORIGINS?: string;
};

export function middyfy<H extends APIGatewayProxyHandler>(
  handler: H,
  env: Env
) {
  const CORS_ORIGINS_ARRAY = (env.CORS_ORIGINS || "")
    .split(",")
    .filter(Boolean)
    .map((origin) => `https://${origin}`);

  return middy(handler)
    .use(middyCors({ origins: CORS_ORIGINS_ARRAY }))
    .use(middyAccessLog())
    .use(middyJsonBodyParser())
    .use(
      middyErrorHandler({
        fallbackMessage: JSON.stringify({ message: "Internal server error" }),
      })
    );
}
