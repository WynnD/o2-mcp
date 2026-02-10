import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { O2Client } from "../o2-client.ts";

export function registerStreamTools(server: McpServer, client: O2Client) {
  server.tool(
    "list_streams",
    "List available streams in OpenObserve. Optionally filter by type and fetch schema.",
    {
      type: z
        .enum(["logs", "metrics", "traces", ""])
        .optional()
        .describe("Stream type filter (logs, metrics, traces, or empty for all)"),
      fetchSchema: z
        .boolean()
        .optional()
        .describe("Include stream schema in response (default false)"),
    },
    async (args) => {
      try {
        const result = await client.listStreams(args);
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

  server.tool(
    "get_stream_stats",
    "Get details and schema for a single stream by name.",
    {
      stream_name: z.string().describe("Name of the stream"),
      type: z
        .enum(["logs", "metrics", "traces", ""])
        .optional()
        .describe("Stream type filter"),
    },
    async (args) => {
      try {
        const result = await client.getStreamSchema(args);
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
