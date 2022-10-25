import {
  PRODUCTS_API_PATH,
  IMPORT_API_PATH,
} from "@commons/constants/api-paths";

declare global {
  interface Window {
    _CONFIG_?: {
      BASE_URL?: string;
    };
  }
}

const BASE_URL = window._CONFIG_?.BASE_URL || "";

const API_PATHS = {
  order: BASE_URL,
  import: `${BASE_URL}/${IMPORT_API_PATH}`,
  products: `${BASE_URL}/${PRODUCTS_API_PATH}`,
  cart: BASE_URL,
};

export default API_PATHS;
