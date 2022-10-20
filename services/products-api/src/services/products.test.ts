import { describe, test, expect } from "vitest";
import { ProductsService } from "./products";

describe("getProducts", () => {
  test("should return products with stock", async () => {
    const productsService = new ProductsService({
      getProducts: () => [
        {
          id: "1",
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
        },
        {
          id: "2",
          title: "Product 2",
          description: "Product 2 description",
          price: 200,
        },
      ],
      getProductsStocks: () => [
        { productId: "1", count: 10 },
        { productId: "2", count: 20 },
      ],
      getProduct(_id) {
        return undefined;
      },
      getProductStock(_id) {
        return 0;
      },
    });

    const products = await productsService.getProducts();

    expect(products).toEqual([
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
    ]);
  });
  test("should return products with 0 stock if product is not in stock", async () => {
    const productsService = new ProductsService({
      getProducts: () => [
        {
          id: "1",
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
        },
        {
          id: "2",
          title: "Product 2",
          description: "Product 2 description",
          price: 200,
        },
      ],
      getProductsStocks: () => [{ productId: "1", count: 10 }],
      getProduct(_id) {
        return undefined;
      },
      getProductStock(_id) {
        return 0;
      },
    });

    const products = await productsService.getProducts();

    expect(products).toEqual([
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
        count: 0,
      },
    ]);
  });
});

describe("getProductById", () => {
  test("should return product with stock", async () => {
    const productsService = new ProductsService({
      getProducts() {
        return [];
      },
      getProductsStocks() {
        return [];
      },
      getProduct(id) {
        return {
          id,
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
        };
      },
      getProductStock(id) {
        return id === "1" ? 10 : 0;
      },
    });

    const product = await productsService.getProductById("1");

    expect(product).toEqual({
      id: "1",
      title: "Product 1",
      description: "Product 1 description",
      price: 100,
      count: 10,
    });
  });
  test("should return undefined if product is not found", async () => {
    const productsService = new ProductsService({
      getProducts() {
        return [];
      },
      getProductsStocks() {
        return [];
      },
      getProduct(_id) {
        return undefined;
      },
      getProductStock(_id) {
        return 0;
      },
    });

    const product = await productsService.getProductById("1");

    expect(product).toBe(undefined);
  });
  test("should return product with 0 stock if product is not in stock", async () => {
    const productsService = new ProductsService({
      getProducts() {
        return [];
      },
      getProductsStocks() {
        return [];
      },
      getProduct(id) {
        return {
          id,
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
        };
      },
      getProductStock(_id) {
        return 0;
      },
    });

    const product = await productsService.getProductById("1");

    expect(product).toEqual({
      id: "1",
      title: "Product 1",
      description: "Product 1 description",
      price: 100,
      count: 0,
    });
  });
});

describe("getAvailableProducts", () => {
  test("should return available products", async () => {
    const productsService = new ProductsService({
      getProducts: () => [
        {
          id: "1",
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
        },
        {
          id: "2",
          title: "Product 2",
          description: "Product 2 description",
          price: 200,
        },
        {
          id: "3",
          title: "Product 3",
          description: "Product 3 description",
          price: 300,
        },
      ],
      getProductsStocks: () => [
        { productId: "1", count: 10 },
        { productId: "2", count: 0 },
      ],
      getProduct(_id) {
        return undefined;
      },
      getProductStock(_id) {
        return 0;
      },
    });

    const products = await productsService.getAvailableProducts();

    expect(products).toEqual([
      {
        id: "1",
        title: "Product 1",
        description: "Product 1 description",
        price: 100,
        count: 10,
      },
    ]);
  });
});
