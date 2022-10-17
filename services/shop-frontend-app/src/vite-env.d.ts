/// <reference types="vitest" />
/// <reference types="vite/client" />

declare module "swagger-ui-react" {
  export default function SwaggerUI(props: any): JSX.Element;
}
declare module "swagger-ui-react/swagger-ui.css" {
  export default string;
}
