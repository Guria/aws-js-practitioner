import { provideAuthService } from "services/provideAuthService";
import { handler } from "functions/basicAuthorizer";

export const main = provideAuthService(handler);
