import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
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

  server.tool(
    "create_destination",
    "Create a new alert destination (notification endpoint) in OpenObserve. Pass the full destination JSON body as a string.",
    {
      destination_json: z
        .string()
        .describe(
          "JSON string of the destination body (see OpenObserve alert destination API docs)",
        ),
    },
    async (args) => {
      try {
        const destination = JSON.parse(args.destination_json);
        const result = await client.createDestination(destination);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
