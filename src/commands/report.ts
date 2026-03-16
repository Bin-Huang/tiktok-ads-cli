import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerReportCommands(program: Command): void {
  program
    .command("report <advertiser-id>")
    .description("Get performance report (synchronous)")
    .requiredOption("--report-type <type>", "Report type: BASIC, AUDIENCE, PLAYABLE_MATERIAL, CATALOG")
    .requiredOption("--data-level <level>", "Data level: AUCTION_ADVERTISER, AUCTION_CAMPAIGN, AUCTION_ADGROUP, AUCTION_AD")
    .requiredOption("--dimensions <dims>", "Dimensions (comma-separated, e.g. campaign_id,stat_time_day)")
    .requiredOption("--metrics <metrics>", "Metrics (comma-separated, e.g. spend,impressions,clicks,ctr,cpc)")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--filters <json>", "Filtering conditions as JSON")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100, max 1000)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, unknown> = {
          advertiser_id: advertiserId,
          report_type: opts.reportType,
          data_level: opts.dataLevel,
          dimensions: JSON.stringify(opts.dimensions.split(",").map((s: string) => s.trim())),
          metrics: JSON.stringify(opts.metrics.split(",").map((s: string) => s.trim())),
          start_date: opts.startDate,
          end_date: opts.endDate,
          page: Number(opts.page),
          page_size: Number(opts.pageSize),
        };
        if (opts.filters) {
          params.filtering = opts.filters;
        }
        const data = await callApi("/report/integrated/get/", {
          accessToken: creds.access_token,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
