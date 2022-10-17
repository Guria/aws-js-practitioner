import { Product } from "@guria.dev/aws-js-practitioner-commons/models/Product";
import { products } from "@guria.dev/aws-js-practitioner-commons/mocks";

class ProductsService {
  constructor(private products: Product[]) {}

  public getProducts(): Product[] {
    return this.products;
  }
}

export default new ProductsService(products);
