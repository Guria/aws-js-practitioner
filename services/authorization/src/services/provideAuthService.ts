import type { APIGatewayTokenAuthorizerEvent } from "aws-lambda/trigger/api-gateway-authorizer";
import { middyfySimpleHandler } from "@guria.dev/aws-js-practitioner-commons/middy";
import { AuthService } from "services/auth";
import { USERS } from "env";
import { middyGeneratePolicy } from "./middyGeneratePolicy";

const authService = new AuthService(USERS);

export type ImportServiceFunctionHandler = (
  authService: AuthService,
  event: APIGatewayTokenAuthorizerEvent,
  context: unknown
) => Promise<boolean>;

export function provideAuthService(handler: ImportServiceFunctionHandler) {
  return middyfySimpleHandler(handler.bind(null, authService)).use(
    middyGeneratePolicy
  );
}
