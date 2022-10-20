import { describe, test, expect } from "vitest";
import { createMockAPIGatewayEvent } from "@homeservenow/serverless-event-mocks";
import type { ProductsService } from "services/products";
import { handler } from "./getProductById";

describe("getProductById", () => {
  test("should return product with stock", async () => {
    const productsService = {
      getProductById: async (id) => {
        return {
          id,
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
          count: 10,
        };
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products/1",
      httpMethod: "GET",
      pathParameters: {
        productId: "1",
      },
    });
    const product = await handler(productsService as ProductsService, event);

    expect(product).toEqual({
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
    const event = createMockAPIGatewayEvent({
      path: "/products/1",
      httpMethod: "GET",
      pathParameters: {
        productId: "1",
      },
    });
    const resultPromise = handler(
      { getProductById: (_id: string) => undefined } as ProductsService,
      event
    );
    expect(resultPromise).rejects.toBeInstanceOf(Error);
  });
});
