import { products } from "@guria.dev/aws-js-practitioner-commons/mocks";
import type { ProductsSource, Product, ProductStock } from "./productsSource";

export class MockProductSource implements ProductsSource {
  products = [...products];
  stocks = this.products.reduce((acc, product, i) => {
    acc[product.id] = i;
    return acc;
  }, {} as Record<string, number>);
  constructor(private genUid: () => string) {}

  public async getProducts(): Promise<Product[]> {
    return this.products;
  }

  public async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  public async getProductsStocks(): Promise<ProductStock[]> {
    return this.products.map((product) => ({
      productId: product.id,
      count: this.stocks[product.id],
    }));
  }

  public async getProductStock(id: string): Promise<number | undefined> {
    return this.stocks[id];
  }

  public async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const newProduct = {
      ...product,
      id: this.genUid(),
    };
    this.products.push(newProduct);
    return newProduct;
  }
}
