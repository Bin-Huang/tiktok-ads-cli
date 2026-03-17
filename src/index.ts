#!/usr/bin/env node
import { Command } from "commander";
import { registerAdvertiserCommands } from "./commands/advertiser.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerAdgroupCommands } from "./commands/adgroups.js";
import { registerAdCommands } from "./commands/ads.js";
import { registerReportCommands } from "./commands/report.js";
import { registerCreativeCommands } from "./commands/creatives.js";
import { registerAudienceCommands } from "./commands/audiences.js";
import { registerReportingCommands } from "./commands/reporting.js";

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
  writeErr: (str: string) => {
    const msg = str.replace(/^error: /i, "").trim();
    if (msg) process.stderr.write(JSON.stringify({ error: msg }) + "\n");
  },
  writeOut: (str: string) => {
    process.stdout.write(str);
  },
});

program.showHelpAfterError(false);

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
registerCreativeCommands(program);
registerAudienceCommands(program);
registerReportingCommands(program);

program.on("command:*", (operands) => {
  process.stderr.write(
    JSON.stringify({ error: `Unknown command: ${operands[0]}. Run --help for available commands.` }) + "\n"
  );
  process.exit(1);
});

// Show help when no command is given
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
