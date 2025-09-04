#!/usr/bin/env node

import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WhenIWorkClient } from "./client.js";
import { tools, handleToolCall } from "./tools.js";

// Initialize the MCP server
const server = new Server(
  {
    name: "wheniwork-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize the WhenIWork client from environment variables
let client: WhenIWorkClient | null = null;

async function initializeClient(): Promise<WhenIWorkClient> {
  if (client) return client;
  
  const apiKey = process.env.WHENIWORK_API_KEY || process.env.WHEN_I_WORK_API_KEY;
  const username = process.env.WHENIWORK_USERNAME || process.env.WHEN_I_WORK_USERNAME;
  const password = process.env.WHENIWORK_PASSWORD || process.env.WHEN_I_WORK_PASSWORD;
  const token = process.env.WHENIWORK_TOKEN || process.env.WHEN_I_WORK_TOKEN;
  const baseUrl = process.env.WHENIWORK_BASE_URL || "https://api.wheniwork.com/2";
  const accountId = process.env.WHENIWORK_ACCOUNT_ID ? 
    parseInt(process.env.WHENIWORK_ACCOUNT_ID) : undefined;

  if (!apiKey) {
    throw new Error("WHENIWORK_API_KEY is required in environment variables");
  }

  // Create client with config
  client = new WhenIWorkClient({
    apiKey,
    username,
    password,
    token,
    baseUrl,
    accountId,
  });

  // Authenticate if needed
  if (!token) {
    if (!username || !password) {
      throw new Error("WHENIWORK_USERNAME and WHENIWORK_PASSWORD are required when token is not provided");
    }
    await client.authenticate();
  }

  return client;
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Initialize client if needed
    const whenIWorkClient = await initializeClient();
    
    // Handle the tool call
    const result = await handleToolCall(whenIWorkClient, name, args || {});
    
    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    // Return error as text content
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message || "Unknown error occurred"}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WhenIWork MCP server started");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
