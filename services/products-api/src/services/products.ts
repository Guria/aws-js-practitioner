import { Product } from "@guria.dev/aws-js-practitioner-commons/models/Product";
export class ProductsService {
  constructor(private products: Product[]) {}

  public getProductById(id: string | number): Product | undefined {
    return this.products.find((item) => item.id === id);
  }

  public getProducts(): Product[] {
    return this.products;
  }
}
