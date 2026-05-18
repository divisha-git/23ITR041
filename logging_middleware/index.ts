import axios from 'axios';

const LOG_SERVER_URL = process.env.LOG_SERVER_URL || 'http://4.224.186.213/evaluation-service/logs';

export async function Log(stack: string, level: string, packageName: string, message: string) {
    const payload = {
        stack,
        level,
        package: packageName,
        message,
        timestamp: new Date().toISOString()
    };

    try {
        await axios.post(LOG_SERVER_URL, payload);
        console.log(`[${level.toUpperCase()}] [${packageName}] ${message}`);
    } catch (err) {
        console.error('Log sync failed:', err instanceof Error ? err.message : 'Unknown error');
        console.log(`[${level.toUpperCase()}] [${packageName}] ${message}`);
    }
}
