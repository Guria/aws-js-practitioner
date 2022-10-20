import { products } from "@guria.dev/aws-js-practitioner-commons/mocks";
import type { ProductsSource, Product, ProductStock } from "./products-source";

export class MockProductSource implements ProductsSource {
  stocks = products.reduce((acc, product, i) => {
    acc[product.id] = i;
    return acc;
  }, {} as Record<string, number>);

  public async getProducts(): Promise<Product[]> {
    return products;
  }

  public async getProduct(id: string): Promise<Product | undefined> {
    return products.find((product) => product.id === id);
  }

  public async getProductsStocks(): Promise<ProductStock[]> {
    return products.map((product) => ({
      productId: product.id,
      count: this.stocks[product.id],
    }));
  }

  public async getProductStock(id: string): Promise<number | undefined> {
    return this.stocks[id];
  }
}
