import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { O2Client } from "./o2-client.ts";
import { registerSearchTools } from "./tools/search.ts";
import { registerStreamTools } from "./tools/streams.ts";
import { registerAlertTools } from "./tools/alerts.ts";
import { registerDestinationTools } from "./tools/destinations.ts";
import { registerTraceTools } from "./tools/traces.ts";
import { registerFunctionTools } from "./tools/functions.ts";
import { registerDashboardTools } from "./tools/dashboards.ts";
import { registerPipelineTools } from "./tools/pipelines.ts";
import { registerOrgTools } from "./tools/org.ts";

const client = new O2Client();
const server = new McpServer({
  name: "o2-mcp",
  version: "1.0.0",
});

registerSearchTools(server, client);
registerStreamTools(server, client);
registerAlertTools(server, client);
registerDestinationTools(server, client);
registerTraceTools(server, client);
registerFunctionTools(server, client);
registerDashboardTools(server, client);
registerPipelineTools(server, client);
registerOrgTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("o2-mcp server running on stdio");
