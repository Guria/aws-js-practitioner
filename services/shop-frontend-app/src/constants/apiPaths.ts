import { PRODUCTS_API_PATH } from "@commons/constants/api-paths";

const BASE_URL = "https://.execute-api.eu-west-1.amazonaws.com/dev";

const API_PATHS = {
  order: BASE_URL,
  import: BASE_URL,
  products: `${BASE_URL}/${PRODUCTS_API_PATH}`,
  cart: BASE_URL,
};

export default API_PATHS;
