import type { APIGatewayTokenAuthorizerEvent } from "aws-lambda/trigger/api-gateway-authorizer";
import type { AuthService } from "../services/auth";

export async function handler(
  authService: AuthService,
  event: APIGatewayTokenAuthorizerEvent
) {
  const { authorizationToken } = event;
  const [, authToken] = authorizationToken.split(" ");

  const isValid = authService.verifyToken(authToken);

  return isValid;
}
