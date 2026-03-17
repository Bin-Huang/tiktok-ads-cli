import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAudienceCommands(program: Command): void {
  program
    .command("custom-audiences <advertiser-id>")
    .description("List custom audiences for an advertiser")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/dmp/custom_audience/list/", {
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
    .command("lookalike-audiences <advertiser-id>")
    .description("List lookalike audiences for an advertiser (uses custom_audience/list - lookalike audiences are a type of custom audience)")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/dmp/custom_audience/list/", {
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
    .command("pixels <advertiser-id>")
    .description("List pixels for an advertiser")
    .option("--page <n>", "Page number (default 1)", "1")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .action(async (advertiserId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/pixel/list/", {
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
    .command("pixel <advertiser-id> <pixel-id>")
    .description("Get a specific pixel")
    .action(async (advertiserId: string, pixelId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/pixel/list/", {
          accessToken: creds.access_token,
          params: {
            advertiser_id: advertiserId,
            pixel_code: pixelId,
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
