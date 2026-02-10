import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { O2Client } from "../o2-client.ts";

export function registerDestinationTools(server: McpServer, client: O2Client) {
  server.tool(
    "list_destinations",
    "List all alert destinations (notification endpoints) in OpenObserve.",
    async () => {
      try {
        const result = await client.listDestinations();
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
