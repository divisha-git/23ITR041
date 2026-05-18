import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:3001/api';

export interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

export const getNotifications = async (params: {
  limit?: number;
  page?: number;
  notification_type?: string;
}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      params
    });
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const getPriorityNotifications = async (n: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/priority`, {
      params: { n }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching priority notifications:', error);
    return [];
  }
};
