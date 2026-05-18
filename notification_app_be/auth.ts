import axios from 'axios';
import { API_BASE_URL } from './constants';

export async function registerCompany() {
    try {
        const payload = {
            companyName: "CampusNotifications", 
            ownerName: "Student",
            rollNo: "23ITR041",
            ownerEmail: "student@example.com",
            accessCode: "zYxWvU" 
        };

        const res = await axios.post(`${API_BASE_URL}/register`, payload);
        return res.data;
    } catch (err) {
        return null;
    }
}

export async function getAuthToken() {
    try {
        const payload = {
            companyName: "CampusNotifications",
            clientID: "your-client-id",
            clientSecret: "your-client-secret",
            ownerName: "Student",
            ownerEmail: "student@example.com",
            rollNo: "23ITR041"
        };

        const res = await axios.post(`${API_BASE_URL}/auth`, payload);
        return res.data.access_token;
    } catch (err) {
        return null;
    }
}
