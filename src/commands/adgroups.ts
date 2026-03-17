import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdgroupCommands(program: Command): void {
  program
    .command("adgroups <advertiser-id>")
    .description("List ad groups for an advertiser")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--status <status>", "Filter by status")
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
        const filtering: Record<string, unknown> = {};
        if (opts.campaignIds) {
          filtering.campaign_ids = opts.campaignIds.split(",").map((s: string) => s.trim());
        }
        if (opts.status) {
          filtering.primary_status = opts.status;
        }
        if (Object.keys(filtering).length > 0) {
          params.filtering = filtering;
        }
        const data = await callApi("/adgroup/get/", {
          accessToken: creds.access_token,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
