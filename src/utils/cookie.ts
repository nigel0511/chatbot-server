import { config } from "dotenv";
config();

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
const ENV = process.env.ENV;

type EnvType = string;
type ModeType = "set" | "clear";
type commonCookieOptionsType = {
  path: string;
  httpOnly: boolean;
  domain: string;
  secure: boolean;
  signed: boolean;
  sameSite?: "none";
};

export function getCookieOptions(
  env: EnvType,
  expiresInDays: number,
  mode: ModeType
) {
  const expires = new Date();
  expires.setDate(expires.getDate() + expiresInDays);

  // Common cookie options that will be used in both environments
  const commonCookieOptions: commonCookieOptionsType = {
    path: "/",
    httpOnly: true, // Prevents client-side access to the cookie (security)
    domain: COOKIE_DOMAIN,
    secure: ENV === "production", // Use secure cookies in production
    signed: true,
  };

  // Add SameSite for 'prod' environment
  if (env === "production") {
    commonCookieOptions["sameSite"] = "none";
  }

  // For 'set' mode, we add an expiration date
  if (mode === "set") {
    return {
      ...commonCookieOptions,
      expires,
    };
  }

  // For 'clear' mode, we omit the expiration date to effectively clear the cookie
  return commonCookieOptions;
}
