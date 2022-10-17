import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";
import { PRODUCTS_API_PATH } from "@guria.dev/aws-js-practitioner-commons/constants/api-paths";

const handler: AWS["functions"][string] = {
  handler: handlerPath(__dirname, "handler.main"),
  events: [
    {
      http: {
        method: "get",
        path: `${PRODUCTS_API_PATH}/{productId}`,
        request: {
          parameters: {
            paths: { productId: true },
          },
        },
      },
    },
  ],
};
export default handler;
