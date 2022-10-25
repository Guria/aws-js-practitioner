import {
  formatJSONResponse,
  JSONParsedBodyEvent,
  createError,
} from "@guria.dev/aws-js-practitioner-commons/middy";
import { ImportService } from "services/import";

export async function handler(
  importService: ImportService,
  event: JSONParsedBodyEvent
) {
  const { name } = event.queryStringParameters;
  if (!name || name.length === 0) {
    throw createError(400, JSON.stringify({ message: "name is required" }));
  }

  const url = await importService.getSignedUrl(name);

  return formatJSONResponse({ url });
}
