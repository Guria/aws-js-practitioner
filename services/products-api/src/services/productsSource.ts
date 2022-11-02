import { MaybePromise } from "@guria.dev/aws-js-practitioner-commons/types";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type ProductStock = {
  productId: string;
  count: number;
};

export type ProductWithStock = Product & { count: number };

export interface ProductsSource {
  getProducts(): MaybePromise<Product[]>;
  getProductsStocks(): MaybePromise<ProductStock[]>;
  getProduct(id: string): MaybePromise<Product | undefined>;
  getProductStock(id: string): MaybePromise<number | undefined>;
  createProduct(
    product: Omit<ProductWithStock, "id">
  ): MaybePromise<ProductWithStock>;
  notifyProductImported(product: Product): MaybePromise<void>;
}
