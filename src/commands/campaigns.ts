import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaigns <advertiser-id>")
    .description("List campaigns for an advertiser")
    .option("--status <status>", "Filter by status (CAMPAIGN_STATUS_ENABLE, CAMPAIGN_STATUS_DISABLE, etc.)")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100, max 1000)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, unknown> = {
          advertiser_id: advertiserId,
          page: Number(opts.page),
          page_size: Number(opts.pageSize),
        };
        if (opts.status) {
          params.filtering = { status: opts.status };
        }
        const data = await callApi("/campaign/get/", {
          accessToken: creds.access_token,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
