import { describe, it, expect } from "vitest";
import { middyfySimpleHandler } from "@guria.dev/aws-js-practitioner-commons/middy";
import { createMockContext } from "@homeservenow/serverless-event-mocks";
import type { APIGatewayTokenAuthorizerEvent } from "aws-lambda/trigger/api-gateway-authorizer";
import type { AuthService } from "services/auth";
import { handler as basicAuthorizer } from "./basicAuthorizer";

const makeHandler = (authService: Partial<AuthService>) => {
  return (event: APIGatewayTokenAuthorizerEvent) => {
    const context = createMockContext();
    return middyfySimpleHandler(basicAuthorizer.bind(null, authService))(
      // @ts-expect-error - middy has wrong type expectations here
      event,
      context
    );
  };
};

describe("basicAuthorizer", () => {
  it("should return true if token is valid", async () => {
    const authService = {
      verifyToken: (token: string) => {
        return token === "VXNlcjpwYXNzd29yZA==";
      },
    };
    const event = {
      type: "TOKEN",
      methodArn:
        "arn:aws:execute-api:eu-west-1:123456789012:1234567890/dev/GET/products",
      authorizationToken: "Basic VXNlcjpwYXNzd29yZA==",
    } as const;
    const result = await makeHandler(authService)(event);

    expect(result).toBe(true);
  });
});
