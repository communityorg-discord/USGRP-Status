# USGRP Status Portal

System status, changelogs, suggestions, and roadmap portal for USGRP.

## Features

- **Status Page** - Real-time service status and uptime monitoring
- **Changelogs** - Version history for all systems
- **Suggestions** - Community feature requests and bug reports
- **Roadmap** - Planned features and development progress
- **Admin Dashboard** - Manage content (requires Admin login)

## Development

```bash
npm install
npm run dev
```

## Environment Variables

```
BOT_API_URL=http://localhost:3003
```

## Deployment

Deploys automatically to `status.usgrp.xyz` via GitHub Actions when pushed to main.
