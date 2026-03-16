import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdCommands(program: Command): void {
  program
    .command("ads <advertiser-id>")
    .description("List ads for an advertiser")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--adgroup-ids <ids>", "Filter by ad group IDs (comma-separated)")
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
        if (opts.adgroupIds) {
          filtering.adgroup_ids = opts.adgroupIds.split(",").map((s: string) => s.trim());
        }
        if (opts.status) {
          filtering.status = opts.status;
        }
        if (Object.keys(filtering).length > 0) {
          params.filtering = filtering;
        }
        const data = await callApi("/ad/get/", {
          accessToken: creds.access_token,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
