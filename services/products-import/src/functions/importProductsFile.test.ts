import { describe, test, expect } from "vitest";
import {
  createMockAPIGatewayEvent,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import { APIGatewayEvent } from "aws-lambda";
import type { ImportService } from "services/import";
import { middyfy } from "@guria.dev/aws-js-practitioner-commons/middy";
import { handler } from "./importProductsFile";

const makeHandler = (productsService: Partial<ImportService>) => {
  return (event: APIGatewayEvent) => {
    const context = createMockContext();
    return middyfy(handler.bind(null, productsService), {})(
      // @ts-expect-error - middy has wrong type expectations here
      event,
      context
    );
  };
};

describe("importProductsFile", () => {
  test("should return signed url", async () => {
    const importService = {
      getSignedUrl: async (name) => {
        return `https://example.com/${name}`;
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/import",
      httpMethod: "GET",
      queryStringParameters: { name: "test.csv" },
    });
    const product = await makeHandler(importService)(event);

    expect(product).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({ url: "https://example.com/test.csv" }),
    });
  });

  test("should return 400 if name is not provided", async () => {
    const importService = {
      getSignedUrl: async (name) => {
        return `https://example.com/${name}`;
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/import",
      httpMethod: "GET",
      queryStringParameters: { name: null },
    });
    const product = await makeHandler(importService)(event);

    expect(product).toMatchObject({
      statusCode: 400,
      body: JSON.stringify({ message: "name is required" }),
    });
  });
});
