# tiktok-ads-cli

TikTok Ads CLI for AI agents (and humans). Pull synchronous and async performance reports, analyze audience demographics, manage custom and lookalike audiences, and more.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g tiktok-ads-cli
```

Or run directly with npx:

```bash
npx tiktok-ads-cli --help
```

## How it works

Built on the official [TikTok Marketing API](https://business-api.tiktok.com/portal/docs). Handles OAuth2 access token authentication. Every command outputs structured JSON to stdout, ready for agents to parse without extra processing.

Core endpoints covered:

- **[Advertiser](https://business-api.tiktok.com/portal/docs)** -- advertiser account info
- **[Campaigns](https://business-api.tiktok.com/portal/docs)** -- list campaigns
- **[Ad Groups](https://business-api.tiktok.com/portal/docs)** -- list ad groups
- **[Ads](https://business-api.tiktok.com/portal/docs)** -- list ads and creatives
- **[Reports](https://business-api.tiktok.com/portal/docs)** -- synchronous and async performance reports, audience reports
- **[Assets](https://business-api.tiktok.com/portal/docs)** -- images, videos, custom audiences, lookalike audiences, pixels

## Setup

### Step 1: Create a TikTok for Business developer account

Go to [TikTok for Business](https://business-api.tiktok.com/portal/docs) and register a developer account. Create an app to get your **App ID** and **Secret**.

### Step 2: Get an access token

Follow the [TikTok OAuth flow](https://business-api.tiktok.com/portal/docs?id=1738373164380162) to obtain an access token for the advertiser accounts you want to manage.

### Step 3: Place the credentials file

```bash
mkdir -p ~/.config/tiktok-ads-cli
cat > ~/.config/tiktok-ads-cli/credentials.json << EOF
{
  "access_token": "YOUR_ACCESS_TOKEN"
}
EOF
```

The `app_id` and `secret` fields are optional in the credentials file. Only `access_token` is required.

Or set the environment variable:

```bash
export TIKTOK_ADS_ACCESS_TOKEN=your_access_token
```

### Step 4: Find your Advertiser ID

Your Advertiser ID is shown in the TikTok Ads Manager URL or can be obtained from the API after authorization.

## Commands

### Get advertiser info

```bash
tiktok-ads-cli advertiser 7000000000000
```

### List campaigns

```bash
tiktok-ads-cli campaigns 7000000000000
tiktok-ads-cli campaigns 7000000000000 --status CAMPAIGN_STATUS_ENABLE
```

### List ad groups

```bash
tiktok-ads-cli adgroups 7000000000000
tiktok-ads-cli adgroups 7000000000000 --campaign-ids 123,456
```

### List ads

```bash
tiktok-ads-cli ads 7000000000000
tiktok-ads-cli ads 7000000000000 --campaign-ids 123 --status AD_STATUS_DELIVERY_OK
```

### Get performance report

```bash
tiktok-ads-cli report 7000000000000 \
  --report-type BASIC \
  --data-level AUCTION_CAMPAIGN \
  --dimensions campaign_id,stat_time_day \
  --metrics spend,impressions,clicks,ctr,cpc \
  --start-date 2026-03-01 \
  --end-date 2026-03-15
```

Options:
- `--report-type <type>` -- report type: BASIC, AUDIENCE, PLAYABLE_MATERIAL, CATALOG (required)
- `--data-level <level>` -- data level: AUCTION_ADVERTISER, AUCTION_CAMPAIGN, AUCTION_ADGROUP, AUCTION_AD (required)
- `--dimensions <dims>` -- dimensions, comma-separated (required)
- `--metrics <metrics>` -- metrics, comma-separated (required)
- `--start-date <date>` -- start date, YYYY-MM-DD (required)
- `--end-date <date>` -- end date, YYYY-MM-DD (required)
- `--filters <json>` -- filtering conditions as JSON
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100, max 1000)

### List images

List image assets for an advertiser.

```bash
tiktok-ads-cli images 7000000000000
tiktok-ads-cli images 7000000000000 --page 2 --page-size 50
```

Options:
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100, max 1000)

### List videos

List video assets for an advertiser.

```bash
tiktok-ads-cli videos 7000000000000
tiktok-ads-cli videos 7000000000000 --page 2 --page-size 50
```

Options:
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100, max 1000)

### List ad creatives

List creative details for ads.

```bash
tiktok-ads-cli ad-creatives 7000000000000
tiktok-ads-cli ad-creatives 7000000000000 --ad-ids 123,456
```

Options:
- `--ad-ids <ids>` -- filter by ad IDs (comma-separated)
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100)

### List custom audiences

List custom audiences for an advertiser.

```bash
tiktok-ads-cli custom-audiences 7000000000000
```

Options:
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100)

### List lookalike audiences

List lookalike audiences for an advertiser (lookalike audiences are a type of custom audience).

```bash
tiktok-ads-cli lookalike-audiences 7000000000000
```

Options:
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100)

### List pixels

List pixels for an advertiser.

```bash
tiktok-ads-cli pixels 7000000000000
```

Options:
- `--page <n>` -- page number (default 1)
- `--page-size <n>` -- page size (default 100)

### Get a pixel

Get a specific pixel by ID.

```bash
tiktok-ads-cli pixel 7000000000000 PIXEL_CODE_123
```

### Create async report

Create an async report task.

```bash
tiktok-ads-cli async-report 7000000000000 \
  --report-type BASIC \
  --dimensions ad_id,stat_time_day \
  --start-date 2026-03-01 \
  --end-date 2026-03-15 \
  --metrics spend,impressions,clicks
```

Options:
- `--report-type <type>` -- report type: BASIC, AUDIENCE, PLAYABLE (required)
- `--dimensions <dims>` -- dimensions, comma-separated (required)
- `--start-date <date>` -- start date, YYYY-MM-DD (required)
- `--end-date <date>` -- end date, YYYY-MM-DD (required)
- `--metrics <metrics>` -- metrics, comma-separated

### Check async report status

Check the status of an async report task.

```bash
tiktok-ads-cli report-status 7000000000000 task_abc123
```

### Get audience report

Get audience analysis report.

```bash
tiktok-ads-cli audience-report 7000000000000 \
  --start-date 2026-03-01 \
  --end-date 2026-03-15 \
  --dimensions gender,age \
  --campaign-ids 123,456
```

Options:
- `--start-date <date>` -- start date, YYYY-MM-DD (required)
- `--end-date <date>` -- end date, YYYY-MM-DD (required)
- `--dimensions <dims>` -- dimensions: gender, age, country_code, language, platform, etc.
- `--campaign-ids <ids>` -- filter by campaign IDs (comma-separated)

## Credentials

Credentials are resolved in this order:

1. `--credentials <path>` flag
2. `TIKTOK_ADS_ACCESS_TOKEN` environment variable
3. `~/.config/tiktok-ads-cli/credentials.json` (auto-detected)

## Output

All output is JSON to stdout. Errors are JSON to stderr with a non-zero exit code.

Use `--format compact` for single-line JSON (useful for piping).

## API Reference

- Official docs: https://business-api.tiktok.com/portal/docs

## Related

- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) - Google Analytics CLI for AI agents
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) - Google Search Console CLI for AI agents

## License

Apache-2.0
