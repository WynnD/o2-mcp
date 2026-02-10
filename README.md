# o2-mcp

MCP server that wraps the OpenObserve REST API, giving Claude Code (and other MCP clients) access to observability data, alerts, and stream management via natural language.

## Setup

```bash
bun install
```

### Environment Variables

Copy `.env.example` and fill in your values:

| Variable | Description |
|----------|-------------|
| `O2_BASE_URL` | OpenObserve URL (e.g. `http://localhost:5080`) |
| `O2_TOKEN` | Base64-encoded `user:password` |
| `O2_ORG` | Organization name (e.g. `default`) |

Generate your token:

```bash
echo -n 'user@example.com:password' | base64
```

### Add to Claude Code

```bash
claude mcp add o2 -- bun run /path/to/o2-mcp/src/index.ts \
  -e O2_BASE_URL=http://localhost:5080 \
  -e O2_TOKEN=your_base64_token \
  -e O2_ORG=default
```

## Available Tools

| Tool | Description |
|------|-------------|
| `query_data` | Run SQL queries against OpenObserve (times in epoch microseconds) |
| `list_streams` | List streams, optionally filtered by type (logs/metrics/traces) |
| `get_stream_stats` | Get details and schema for a single stream |
| `list_alerts` | List all configured alerts |
| `create_alert` | Create a new alert (pass JSON body as string) |
| `update_alert` | Update an existing alert by ID |
| `delete_alert` | Delete an alert by ID |
| `list_destinations` | List alert notification destinations |
| `get_latest_traces` | Fetch recent traces from a trace stream |

## Running Standalone

```bash
bun run src/index.ts
```

The server communicates over stdio using the MCP protocol.
