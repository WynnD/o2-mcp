import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { O2Client } from "../o2-client.ts";

export function registerSearchTools(server: McpServer, client: O2Client) {
  server.tool(
    "query_data",
    "Run a SQL query against OpenObserve. Times are epoch microseconds.",
    {
      sql: z.string().describe("SQL query (e.g. SELECT * FROM \"default\")"),
      start_time: z.number().describe("Start time in epoch microseconds"),
      end_time: z.number().describe("End time in epoch microseconds"),
      from: z.number().optional().describe("Pagination offset (default 0)"),
      size: z.number().optional().describe("Result limit (default 100)"),
    },
    async (args) => {
      try {
        const result = await client.search(args);
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
