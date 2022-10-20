import { describe, test, expect } from "vitest";
import type { ProductsService } from "services/products";
import { handler } from "./getProductsList";

describe("getProductsList", () => {
  test("should return products list", async () => {
    const productsService = {
      getAvailableProducts: async () => {
        return [
          {
            id: "1",
            title: "Product 1",
            description: "Product 1 description",
            price: 100,
            count: 10,
          },
          {
            id: "2",
            title: "Product 2",
            description: "Product 2 description",
            price: 200,
            count: 20,
          },
        ];
      },
    };
    const product = await handler(productsService as ProductsService);

    expect(product).toEqual({
      statusCode: 200,
      body: JSON.stringify([
        {
          id: "1",
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
          count: 10,
        },
        {
          id: "2",
          title: "Product 2",
          description: "Product 2 description",
          price: 200,
          count: 20,
        },
      ]),
    });
  });
});
