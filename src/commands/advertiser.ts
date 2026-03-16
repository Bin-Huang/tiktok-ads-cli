import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdvertiserCommands(program: Command): void {
  program
    .command("advertiser <advertiser-ids>")
    .description("Get advertiser account details")
    .action(async (advertiserIds: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const ids = advertiserIds.split(",").map((s) => s.trim());
        const data = await callApi("/advertiser/info/", {
          accessToken: creds.access_token,
          params: {
            advertiser_ids: ids,
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
