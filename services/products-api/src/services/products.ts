import { Product, ProductsSource } from "./productsSource";

export class ProductsService {
  constructor(private source: ProductsSource) {}

  public async getProductById(id: string) {
    const [product, stock] = await Promise.all([
      this.source.getProduct(id),
      this.source.getProductStock(id),
    ]);

    if (!product) {
      return undefined;
    }

    return {
      ...product,
      count: stock !== undefined ? stock : 0,
    };
  }

  public async getProducts() {
    const productsPromise = this.source.getProducts();
    const stocksPromise = this.source.getProductsStocks();

    const stocksMap = (await stocksPromise).reduce(
      (acc, { productId, count }) => {
        acc[productId] = count;
        return acc;
      },
      {} as Record<string, number>
    );

    return (await productsPromise).map((product) => ({
      ...product,
      count: stocksMap[product.id] || 0,
    }));
  }

  public async getAvailableProducts() {
    return (await this.getProducts()).filter((product) => product.count > 0);
  }

  public async createProduct(product: Omit<Product, "id">) {
    return this.source.createProduct(product);
  }
}
