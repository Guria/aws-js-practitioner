import { describe, test, expect } from "vitest";
import {
  createMockAPIGatewayEvent,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import type { APIGatewayEvent } from "aws-lambda";
import type { ProductsService } from "services/products";
import { middyfyGatewayHandler } from "@guria.dev/aws-js-practitioner-commons/middy";
import { handler } from "./getProductById";

const makeHandler = (productsService: Partial<ProductsService>) => {
  return (event: APIGatewayEvent) => {
    const context = createMockContext();
    return middyfyGatewayHandler(handler.bind(null, productsService), {})(
      // @ts-expect-error - middy has wrong type expectations here
      event,
      context
    );
  };
};

describe("getProductById", () => {
  test("should return product with stock", async () => {
    const productsService = {
      getProductById: async (productId) => {
        return {
          id: productId,
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
          count: 10,
        };
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products/1",
      pathParameters: { productId: "1" },
      httpMethod: "GET",
    });
    const product = await makeHandler(productsService)(event);

    expect(product).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({
        id: "1",
        title: "Product 1",
        description: "Product 1 description",
        price: 100,
        count: 10,
      }),
    });
  });
  test("should throw an error if product is not found", async () => {
    const productsService = {
      getProductById: async (_productId) => {
        return null;
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products/1",
      httpMethod: "GET",
    });
    const product = await makeHandler(productsService)(event);

    expect(product).toMatchObject({
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    });
  });
});
