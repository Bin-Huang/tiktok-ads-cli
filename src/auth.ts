import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export interface TikTokCredentials {
  access_token: string;
  app_id?: string;
  secret?: string;
}

const DEFAULT_PATH = join(
  homedir(),
  ".config",
  "tiktok-ads-cli",
  "credentials.json"
);

export function loadCredentials(
  credentialsPath?: string
): TikTokCredentials {
  // 1. --credentials flag
  if (credentialsPath) {
    return readJSON(credentialsPath);
  }

  // 2. TIKTOK_ADS_ACCESS_TOKEN env var (simple mode)
  if (process.env.TIKTOK_ADS_ACCESS_TOKEN) {
    return {
      access_token: process.env.TIKTOK_ADS_ACCESS_TOKEN,
      app_id: process.env.TIKTOK_ADS_APP_ID,
      secret: process.env.TIKTOK_ADS_SECRET,
    };
  }

  // 3. Default credentials file
  if (existsSync(DEFAULT_PATH)) {
    return readJSON(DEFAULT_PATH);
  }

  throw new Error(
    `No credentials found. Provide one of:\n` +
      `  1. --credentials <path> flag\n` +
      `  2. TIKTOK_ADS_ACCESS_TOKEN env var\n` +
      `  3. ${DEFAULT_PATH}`
  );
}

function readJSON(path: string): TikTokCredentials {
  const raw = readFileSync(path, "utf-8");
  const data = JSON.parse(raw);
  if (!data.access_token) {
    throw new Error(`credentials file missing "access_token": ${path}`);
  }
  return data;
}
