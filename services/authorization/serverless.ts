import type { AWS } from "@serverless/typescript";

import functions from "./functions";

const serverlessConfiguration: AWS = {
  service: "ajp-authorization",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: ["serverless-esbuild"],
  configValidationMode: "error",
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      USER_GURIA: "${env:USER_GURIA}",
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      restApiId: "${param:ApiGatewayRestApiId}",
      restApiRootResourceId: "${param:ApiGatewayRestApiRootResourceId}",
    },
  },
  functions,
  resources: {
    Resources: {
      BasicAuthorizer: {
        Type: "AWS::ApiGateway::Authorizer",
        Properties: {
          Name: "basicAuthorizer",
          Type: "TOKEN",
          IdentitySource: "method.request.header.Authorization",
          IdentityValidationExpression: "Basic .*",
          RestApiId: "${param:ApiGatewayRestApiId}",
          AuthorizerResultTtlInSeconds: 300,
          AuthorizerUri: {
            "Fn::Join": [
              "",
              [
                "arn:aws:apigateway:",
                { Ref: "AWS::Region" },
                ":lambda:path/2015-03-31/functions/",
                { "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"] },
                "/invocations",
              ],
            ],
          },
        },
      },
      BasicAuthorizerPermission: {
        Type: "AWS::Lambda::Permission",
        Properties: {
          Action: "lambda:invokeFunction",
          Principal: "apigateway.amazonaws.com",
          FunctionName: {
            "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"],
          },
          SourceArn: {
            "Fn::Join": [
              "",
              [
                "arn:aws:execute-api:",
                { Ref: "AWS::Region" },
                ":",
                { Ref: "AWS::AccountId" },
                ":",
                "${param:ApiGatewayRestApiId}",
                "/authorizers/",
                { Ref: "BasicAuthorizer" },
              ],
            ],
          },
        },
      },
    },
    Outputs: {
      BasicAuthorizerId: {
        Value: {
          "Fn::GetAtt": ["BasicAuthorizer", "AuthorizerId"],
        },
      },
    },
  },
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
