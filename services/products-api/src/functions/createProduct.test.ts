import { describe, test, expect } from "vitest";
import {
  createMockAPIGatewayEvent,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import { APIGatewayEvent } from "aws-lambda";
import type { ProductsService } from "services/products";
import { middyfy } from "@guria.dev/aws-js-practitioner-commons/middy";
import { handler } from "./createProduct";

const makeHandler = (productsService: Partial<ProductsService>) => {
  return (event: APIGatewayEvent) => {
    const context = createMockContext();
    return middyfy(handler.bind(null, productsService), {})(
      // @ts-expect-error - middy has wrong type expectations here
      event,
      context
    );
  };
};

describe("createProduct", () => {
  test("should create product", async () => {
    const productsService = {
      createProduct: async (product) => {
        return { ...product, id: "1" };
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products",
      httpMethod: "POST",
      body: JSON.stringify({
        title: "Product 1",
        description: "Product 1 description",
        price: 100,
        count: 10,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const product = await makeHandler(productsService)(event);

    expect(product).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({
        title: "Product 1",
        description: "Product 1 description",
        price: 100,
        count: 10,
        id: "1",
      }),
    });
  });
  test("should return 400 if validation failed", async () => {
    const productsService = {
      createProduct: async (product) => {
        return { ...product, id: "1" };
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products",
      httpMethod: "POST",
      body: JSON.stringify({
        title: "Product 1",
        description: "Product 1 description",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const product = await makeHandler(productsService)(event);

    expect(product).toMatchObject({
      statusCode: 400,
      body: JSON.stringify({
        message:
          "Invariant failed: Price is required and should be greater than 0",
      }),
    });
  });
  test("should return 500 if service failed", async () => {
    const productsService = {
      createProduct: async (_product) => {
        throw new Error("Service failed");
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products",
      httpMethod: "POST",
      body: JSON.stringify({
        title: "Product 1",
        description: "Product 1 description",
        price: 100,
        count: 10,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const product = await makeHandler(productsService)(event);

    expect(product).toMatchObject({
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    });
  });
});
