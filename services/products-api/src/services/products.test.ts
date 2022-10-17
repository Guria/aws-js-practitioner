import { describe, test, expect } from "vitest";
import { ProductsService } from "./products";

describe("getProducts", () => {
  test("should return products", () => {
    const products = [
      { id: "1", title: "product 1", description: "description 1", price: 1 },
      { id: "2", title: "product 2", description: "description 2", price: 2 },
    ];
    const service = new ProductsService(products);
    expect(service.getProducts()).toEqual(products);
  });
});

describe("getProductById", () => {
  test("should return undefined if product not found", () => {
    const service = new ProductsService([]);
    expect(service.getProductById(1)).toBeUndefined();
  });
  test("should return product by id", () => {
    const service = new ProductsService([
      { id: "1", title: "product 1", description: "description 1", price: 1 },
      { id: "2", title: "product 2", description: "description 2", price: 2 },
    ]);
    expect(service.getProductById("1")).toEqual({
      id: "1",
      title: "product 1",
      description: "description 1",
      price: 1,
    });
  });
});
