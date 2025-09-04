# WhenIWork MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with the WhenIWork API v2. This server enables AI assistants to manage workforce scheduling, time tracking, and employee management through natural language.

## Features

- **User Management**: List, create, update users and manage roles
- **Shift Scheduling**: Create, update, publish shifts and manage schedules  
- **Time & Attendance**: Clock in/out, track time entries
- **Time Off Requests**: Submit and manage time off requests
- **Positions & Locations**: Manage job roles and work locations
- **Availability**: Set and view employee availability
- **Payroll**: Generate payroll reports
- **Messaging**: Send messages to employees

## Installation

```bash
npm install
npm run build
```

## Configuration

### Environment Variables

Set the following environment variables in your `.env` file:

```bash
# Required - WhenIWork API Credentials
WHENIWORK_API_KEY=your_api_key_here
WHENIWORK_USERNAME=your_username
WHENIWORK_PASSWORD=your_password

# Optional - Direct token (if you already have one)
WHENIWORK_TOKEN=your_token_here

# Optional - API Settings
WHENIWORK_BASE_URL=https://api.wheniwork.com/2  # Default
WHENIWORK_ACCOUNT_ID=your_account_id  # If you have multiple accounts
```

### MCP Configuration

Add to your Claude Desktop or other MCP client configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "wheniwork": {
      "command": "node",
      "args": ["/path/to/wheniwork-mcp/dist/index.js"],
      "env": {
        "WHENIWORK_API_KEY": "your_api_key",
        "WHENIWORK_USERNAME": "your_username",
        "WHENIWORK_PASSWORD": "your_password"
      }
    }
  }
}
```

## Available Tools

The complete list of tools is available in the server. Key tools include:

### User Management
- List, create, update, and delete users
- Manage roles and permissions

### Shift Management  
- Create, update, delete shifts
- Publish unpublished shifts
- Assign open shifts to users

### Time Clock
- Clock in/out users
- View time entries

### Time Off & Availability
- Submit and manage time off requests
- Set and view availability

### Reporting
- Generate payroll reports
- Create various workforce analytics

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Test with MCP Inspector
npm run inspector
```

## API Documentation

This server implements the WhenIWork API v2. For detailed API documentation, see:
- [WhenIWork API Documentation](https://apidocs.wheniwork.com/external/index.html)

## License

MIT
