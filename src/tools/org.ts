import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { O2Client } from "../o2-client.ts";

export function registerOrgTools(server: McpServer, client: O2Client) {
  server.tool(
    "get_org_summary",
    "Get organization summary including stream count, total records, storage size, and ingestion stats.",
    async () => {
      try {
        const result = await client.getOrgSummary();
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
    "get_config",
    "Get OpenObserve server configuration including version, commit hash, and build info.",
    async () => {
      try {
        const result = await client.getConfig();
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
    "healthz",
    "Check OpenObserve server health status.",
    async () => {
      try {
        const result = await client.healthz();
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
