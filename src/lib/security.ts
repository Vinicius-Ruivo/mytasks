const TAG_REGEX = /<\/?[^>]+(>|$)/g;
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const JS_PROTOCOL_REGEX = /javascript:/gi;
const EVENT_HANDLER_REGEX = /\son\w+="[^"]*"/gi;

export function sanitizeText(input: string): string {
  return input
    .replace(SCRIPT_REGEX, "")
    .replace(JS_PROTOCOL_REGEX, "")
    .replace(EVENT_HANDLER_REGEX, "")
    .replace(TAG_REGEX, "")
    .trim();
}
