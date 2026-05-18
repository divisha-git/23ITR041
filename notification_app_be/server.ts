import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { Log } from '../logging_middleware';
import { NOTIFICATION_WEIGHTS, API_BASE_URL } from './constants';

import { registerCompany, getAuthToken } from './auth';

const app = express();
const PORT = process.env.PORT || 3001;

let authToken: string | null = null;

// Initial setup to ensure we have a token
async function initializeAuth() {
    try {
        await Log('auth-init', 'info', 'notification-app', 'Initializing authentication flow');
        authToken = await getAuthToken();
        
        if (!authToken) {
            await Log('auth-init', 'warn', 'notification-app', 'Auth failed, attempting company registration');
            await registerCompany();
            authToken = await getAuthToken();
        }

        if (authToken) {
            await Log('auth-init', 'info', 'notification-app', 'Authentication successful, token acquired');
        } else {
            await Log('auth-init', 'error', 'notification-app', 'Failed to acquire authentication token after registration');
        }
    } catch (err) {
        await Log(err instanceof Error ? err.stack || '' : '', 'error', 'notification-app', 'Critical error during authentication initialization');
    }
}

initializeAuth();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <h1>Campus Notifications API</h1>
        <p>Status: Running</p>
        <p>Port: ${PORT}</p>
        <hr/>
        <p>To view the dashboard, please visit: <a href="http://localhost:3000">http://localhost:3000</a></p>
    `);
});

interface Notification {
    ID: string;
    Type: 'Placement' | 'Result' | 'Event';
    Message: string;
    Timestamp: string;
}

async function getPriorityNotifications(token: string, limit: number = 10) {
    const pkg = 'notification-service';
    
    try {
        await Log('getPriorityNotifications', 'info', pkg, `Fetching notifications with limit ${limit}`);
        
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const notifications: Notification[] = response.data.notifications;

        if (!notifications) {
            await Log('getPriorityNotifications', 'warn', pkg, 'No notifications found in response');
            return [];
        }

        const sorted = notifications.sort((a, b) => {
            const weightA = NOTIFICATION_WEIGHTS[a.Type] || 0;
            const weightB = NOTIFICATION_WEIGHTS[b.Type] || 0;

            if (weightA !== weightB) {
                return weightB - weightA;
            }

            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });

        const topN = sorted.slice(0, limit);
        
        return topN;
    } catch (err) {
        throw err;
    }
}
// Proxy for all notifications with filtering and pagination
app.get('/api/notifications', async (req, res) => {
    const { limit, page, notification_type } = req.query;

    if (!authToken) {
        return res.status(503).json({ error: 'Service initializing' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
            params: { limit, page, notification_type },
            headers: { Authorization: `Bearer ${authToken}` }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Service unavailable' });
    }
});

app.get('/api/notifications/priority', async (req, res) => {
    const n = parseInt(req.query.n as string) || 10;

    if (!authToken) {
        return res.status(503).json({ error: 'Service initializing' });
    }

    try {
        const priorityNotifications = await getPriorityNotifications(authToken, n);
        res.json(priorityNotifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch priority notifications' });
    }
});

app.listen(PORT, async () => {
    await Log('server-init', 'info', 'notification-app', `Server started and listening on port ${PORT}`);
});
