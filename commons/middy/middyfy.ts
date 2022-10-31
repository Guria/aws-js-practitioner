import type {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  S3Event,
} from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import middyCors from "@middy/http-cors";
import middyErrorHandler from "@middy/http-error-handler";
import middyAccessLog from "@schibsted/middy-access-log";
import middyInputOutputLogger from "@middy/input-output-logger";
import middyErrorLogger from "@middy/error-logger";

type GatewayEnv = {
  CORS_ORIGINS?: string;
};

type APIGatewayProxyHandler = Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>;

export function middyfyGatewayHandler<H extends APIGatewayProxyHandler>(
  handler: H,
  env: GatewayEnv
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

type S3Handler = Handler<S3Event, void>;

export function middyfySimpleHandler<H extends S3Handler>(handler: H) {
  return middy(handler).use(middyInputOutputLogger()).use(middyErrorLogger());
}
