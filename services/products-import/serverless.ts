import type { AWS } from "@serverless/typescript";

import functions from "./functions";

const serverlessConfiguration: AWS = {
  service: "ajp-products-import",
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  functions,
  package: { individually: true },
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
