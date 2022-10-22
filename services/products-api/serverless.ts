import type { AWS } from "@serverless/typescript";

import functions from "./functions";

const serverlessConfiguration: AWS = {
  service: "ajp-products-api",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  configValidationMode: "error",
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      restApiId: "${param:ApiGatewayRestApiId}",
      restApiRootResourceId: "${param:ApiGatewayRestApiRootResourceId}",
    },
    environment: {
      CORS_ORIGINS:
        "${param:WebAppCustomDomain},${param:WebAppDistributionDomain}",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE: {
        Ref: "ProductsTable",
      },
      PRODUCT_STOCKS_TABLE: {
        Ref: "ProductStocksTable",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:Scan", "dynamodb:GetItem", "dynamodb:PutItem"],
            Resource: [
              { "Fn::GetAtt": ["ProductsTable", "Arn"] },
              { "Fn::GetAtt": ["ProductStocksTable", "Arn"] },
            ],
          },
        ],
      },
    },
  },
  functions,
  package: { individually: true },
  // @ts-expect-error - typings doesn't support file imports
  resources: "${file(resources.yml)}",
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
