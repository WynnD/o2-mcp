# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An MCP (Model Context Protocol) server that exposes OpenObserve observability tools — SQL queries, stream management, alerts, destinations, and traces. Claude Code (or any MCP client) connects via stdio.

## Commands

```bash
bun install              # Install dependencies
bun run src/index.ts     # Run the MCP server (stdio transport)
bun test                 # Run tests
```

Use `bun` exclusively — never npm/node/npx. Bun auto-loads `.env`.

## Environment Variables

Defined in `.env` (see `.env.example`):
- `O2_BASE_URL` — OpenObserve URL, no trailing slash
- `O2_TOKEN` — Base64-encoded `user:password`
- `O2_ORG` — Organization name (e.g. `default`)

## Architecture

```
src/
├── index.ts          # Server setup: creates O2Client + McpServer, registers tools, connects stdio
├── o2-client.ts      # Pure HTTP client for OpenObserve REST API (no MCP knowledge)
└── tools/
    ├── search.ts       # query_data — SQL queries against O2
    ├── streams.ts      # list_streams, get_stream_stats
    ├── alerts.ts       # list/create/update/delete alerts
    ├── destinations.ts # list/create destinations, list alert templates
    ├── traces.ts       # get_latest_traces
    ├── functions.ts    # list_functions (VRL functions)
    ├── dashboards.ts   # list_dashboards
    ├── pipelines.ts    # list_pipelines
    └── org.ts          # get_org_summary, get_config, healthz
```

**Separation of concerns:** `o2-client.ts` handles all HTTP/auth. Tool files in `tools/` only handle MCP registration and Zod schemas. `index.ts` wires them together.

## Tool Registration Pattern

Every tool file exports a `registerXxxTools(server: McpServer, client: O2Client)` function. Tools follow this shape:

1. Define Zod schema for parameters
2. Call `server.tool(name, description, schema, handler)`
3. Handler calls `client.methodName()`, returns JSON as `{ content: [{ type: "text", text }] }`
4. Errors caught and returned with `isError: true`

## Key Conventions

- All timestamps are **epoch microseconds** (not milliseconds)
- Alert/destination tools accept raw JSON strings (`alert_json`, `destination_json`) rather than structured params
- O2Client auth uses `Basic` header with the Base64 token from env
- API base path pattern: `/api/{org}/...`
- Server logs to stderr (stdout is the MCP stdio transport)
