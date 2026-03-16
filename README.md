# tiktok-ads-cli

A TikTok Ads CLI designed for AI agents. Wraps the official TikTok Marketing API with simple, agent-friendly commands.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g tiktok-ads-cli
```

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
  "access_token": "YOUR_ACCESS_TOKEN",
  "app_id": "YOUR_APP_ID",
  "secret": "YOUR_SECRET"
}
EOF
```

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
