import type { AWS } from "@serverless/typescript";
import { PRODUCTS_API_PATH } from "@guria.dev/aws-js-practitioner-commons/constants/api-paths";

const config: AWS["functions"] = {
  getProductsList: {
    handler: "src/handlers/getProductsList.main",
    events: [
      {
        http: {
          method: "get",
          path: PRODUCTS_API_PATH,
        },
      },
    ],
  },
  getProductById: {
    handler: "src/handlers/getProductById.main",
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
  },
};

export default config;
