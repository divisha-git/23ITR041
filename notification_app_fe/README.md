# Campus Notification Platform

A professional notification management system designed for campus updates, including Placements, Results, and Events.

## Project Components

### 1. Logging Middleware
A reusable package that centralizes application logging. It synchronizes logs with a remote server and provides structured diagnostic information across the entire stack.

### 2. Notification Backend
An Express-based service built with TypeScript. It serves as a secure bridge to the notification infrastructure, implementing advanced prioritization algorithms to deliver the most critical information first.

### 3. Notification Frontend
A responsive React application styled with Material UI. It provides a dual-dashboard view:
- **Unified Feed**: Filterable and paginated view of all campus updates.
- **Priority Inbox**: Smart ranking of top notifications based on weight and recency.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Install dependencies for all components:
```bash
cd logging_middleware && npm install
cd ../notification_app_be && npm install
cd ../notification_app_fe && npm install
```

2. Start the Backend:
```bash
cd notification_app_be
npm run dev
```

3. Start the Frontend:
```bash
cd notification_app_fe
npm run dev
```

The application will be available at `http://localhost:3000`.
