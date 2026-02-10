import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { O2Client } from "../o2-client.ts";

export function registerTraceTools(server: McpServer, client: O2Client) {
  server.tool(
    "get_latest_traces",
    "Get the latest traces from a trace stream. Times are epoch microseconds.",
    {
      stream_name: z.string().describe("Trace stream name"),
      start_time: z.number().describe("Start time in epoch microseconds"),
      end_time: z.number().describe("End time in epoch microseconds"),
      from: z.number().optional().describe("Pagination offset (default 0)"),
      size: z.number().optional().describe("Result limit (default 20)"),
    },
    async (args) => {
      try {
        const result = await client.getLatestTraces(args);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        };
      }
    },
  );
}
