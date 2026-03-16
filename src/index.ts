#!/usr/bin/env node
import { Command } from "commander";
import { registerAdvertiserCommands } from "./commands/advertiser.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerAdgroupCommands } from "./commands/adgroups.js";
import { registerAdCommands } from "./commands/ads.js";
import { registerReportCommands } from "./commands/report.js";

const program = new Command();

program
  .name("tiktok-ads-cli")
  .description("TikTok Ads CLI for AI agents")
  .version("0.1.0")
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/tiktok-ads-cli"
  );

program.configureOutput({
  writeErr: (str) => {
    // Suppress commander's default error output; we handle errors ourselves
  },
});

// Validate format
program.hook("preAction", (_thisCommand) => {
  const format = program.opts().format;
  if (format !== "json" && format !== "compact") {
    process.stderr.write(
      JSON.stringify({ error: "Format must be 'json' or 'compact'." }) + "\n"
    );
    process.exit(1);
  }
});

registerAdvertiserCommands(program);
registerCampaignCommands(program);
registerAdgroupCommands(program);
registerAdCommands(program);
registerReportCommands(program);

// Show help when no command is given
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
