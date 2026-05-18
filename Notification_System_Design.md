# Notification_System_Design

# Stage 1

The system addresses the challenge of notification fatigue by implementing a smart Priority Inbox. This ensures that critical updates are never missed among high volumes of data.

### Prioritization Strategy
The ranking logic uses a composite scoring mechanism:
- **Category Weights**: Placement (3) > Result (2) > Event (1).
- **Recency**: Within the same category, newer notifications rank higher.

The backend retrieves notifications from the external protected API and applies this sorting algorithm in-memory to provide an efficient "top n" view for the user.

### Logging Implementation
A centralized logging middleware is used to synchronize diagnostic events with the remote server. This tracks API lifecycle events and ensures system observability.

# Stage 2

### Frontend Architecture
A responsive single-page application built with React and Material UI, adhering to production-grade design standards.

### Key Capabilities
- **Dual Dashboard**: Separate views for a unified feed and a priority-ranked feed.
- **Dynamic Interaction**: Full support for API-driven filtering (by notification type) and pagination.
- **Read Management**: Client-side state tracking using LocalStorage to distinguish between new and already viewed notifications.
- **Responsive UX**: Optimized layouts for both desktop and mobile devices using Material UI's grid system.

### Technical Stack
- **UI**: Material UI (MUI).
- **Core**: React 18, TypeScript.
- **Data**: Axios for proxied API communication.
