import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { O2Client } from "../o2-client.ts";

export function registerAlertTools(server: McpServer, client: O2Client) {
  server.tool(
    "list_alerts",
    "List all alerts configured in OpenObserve.",
    async () => {
      try {
        const result = await client.listAlerts();
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
    "create_alert",
    "Create a new alert in OpenObserve. Pass the full alert JSON body as a string.",
    {
      alert_json: z
        .string()
        .describe("JSON string of the alert body (see OpenObserve alert API docs)"),
    },
    async (args) => {
      try {
        const alert = JSON.parse(args.alert_json);
        const result = await client.createAlert(alert);
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
    "update_alert",
    "Update an existing alert. Pass the alert ID and the full updated alert JSON body.",
    {
      alert_id: z.string().describe("Alert ID to update"),
      alert_json: z
        .string()
        .describe("JSON string of the updated alert body"),
    },
    async (args) => {
      try {
        const alert = JSON.parse(args.alert_json);
        const result = await client.updateAlert(args.alert_id, alert);
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
    "delete_alert",
    "Delete an alert by ID.",
    {
      alert_id: z.string().describe("Alert ID to delete"),
    },
    async (args) => {
      try {
        const result = await client.deleteAlert(args.alert_id);
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
