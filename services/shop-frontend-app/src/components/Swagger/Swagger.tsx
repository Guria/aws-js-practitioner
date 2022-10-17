import React, { Suspense } from "react";

const SwaggerUI = React.lazy(() => import("swagger-ui-react"));
const SwaggerStyles = React.lazy(() => import("./SwaggerStyles"));
export default function Swagger() {
  return (
    <Suspense>
      <SwaggerUI url="/swagger.json" />;
      <SwaggerStyles />
    </Suspense>
  );
}
