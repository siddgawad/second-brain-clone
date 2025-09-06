import crypto from "crypto";
export function randomId(bytes: number = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}
