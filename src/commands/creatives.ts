import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCreativeCommands(program: Command): void {
  program
    .command("images <advertiser-id>")
    .description("List image assets for an advertiser")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100, max 1000)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/file/image/ad/get/", {
          accessToken: creds.access_token,
          params: {
            advertiser_id: advertiserId,
            page: Number(opts.page),
            page_size: Number(opts.pageSize),
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("videos <advertiser-id>")
    .description("List video assets for an advertiser")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100, max 1000)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/file/video/ad/get/", {
          accessToken: creds.access_token,
          params: {
            advertiser_id: advertiserId,
            page: Number(opts.page),
            page_size: Number(opts.pageSize),
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-creatives <advertiser-id>")
    .description("List creative details for ads")
    .option("--ad-ids <ids>", "Filter by ad IDs (comma-separated)")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, unknown> = {
          advertiser_id: advertiserId,
          page: Number(opts.page),
          page_size: Number(opts.pageSize),
        };
        if (opts.adIds) {
          params.filtering = { ad_ids: opts.adIds.split(",") };
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
