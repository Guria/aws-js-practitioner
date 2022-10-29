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
  createProduct: {
    handler: "src/handlers/createProduct.main",
    events: [
      {
        http: {
          method: "post",
          path: PRODUCTS_API_PATH,
          cors: true,
          request: {
            schemas: {
              "application/json": {
                name: "Product",
                schema: "${file(src/functions/createProduct.schema.json)}",
              },
            },
          },
        },
      },
    ],
  },
  catalogBatchProcess: {
    handler: "src/handlers/catalogBatchProcess.main",
    events: [
      {
        sqs: {
          batchSize: 5,
          arn: { "Fn::GetAtt": ["ImportedProductsQueue", "Arn"] },
        },
      },
    ],
  },
};

export default config;
