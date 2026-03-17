import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerReportingCommands(program: Command): void {
  program
    .command("async-report <advertiser-id>")
    .description("Create an async report task")
    .requiredOption("--report-type <type>", "Report type: BASIC, AUDIENCE, PLAYABLE")
    .requiredOption("--dimensions <dims>", "Dimensions (comma-separated): ad_id, adgroup_id, campaign_id, stat_time_day, stat_time_hour, country_code, etc.")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--metrics <metrics>", "Metrics (comma-separated): spend, impressions, clicks, cpc, cpm, ctr, conversion, cost_per_conversion, etc.")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const body: Record<string, unknown> = {
          advertiser_id: advertiserId,
          report_type: opts.reportType,
          dimensions: opts.dimensions.split(","),
          data_level: "AUCTION_AD",
          start_date: opts.startDate,
          end_date: opts.endDate,
        };
        if (opts.metrics) body.metrics = opts.metrics.split(",");
        const data = await callApi("/report/task/create/", {
          accessToken: creds.access_token,
          method: "POST",
          body,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("report-status <advertiser-id> <task-id>")
    .description("Check async report task status")
    .action(async (advertiserId: string, taskId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/report/task/check/", {
          accessToken: creds.access_token,
          params: {
            advertiser_id: advertiserId,
            task_id: taskId,
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("audience-report <advertiser-id>")
    .description("Get audience analysis report")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--dimensions <dims>", "Dimensions: gender, age, country_code, language, platform, etc.")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, unknown> = {
          advertiser_id: advertiserId,
          start_date: opts.startDate,
          end_date: opts.endDate,
        };
        if (opts.dimensions) params.dimensions = opts.dimensions.split(",");
        if (opts.campaignIds) {
          params.filters = [{ field_name: "campaign_ids", filter_type: "IN", filter_value: opts.campaignIds }];
        }
        const data = await callApi("/report/audience/get/", {
          accessToken: creds.access_token,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
