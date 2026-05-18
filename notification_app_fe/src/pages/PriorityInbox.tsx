import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress,
  Stack,
  Alert,
  TextField
} from '@mui/material';
import { getPriorityNotifications, type Notification } from '../services/notificationService';

const PriorityInbox: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [n, setN] = useState(10);

  useEffect(() => {
    fetchPriority();
  }, [n]);

  const fetchPriority = async () => {
    setLoading(true);
    const data = await getPriorityNotifications(n);
    setNotifications(data || []);
    setLoading(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Placement': return 'error';
      case 'Result': return 'warning';
      case 'Event': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Priority Inbox</Typography>
        
        <TextField
          label="Top n"
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          size="small"
          sx={{ width: 100 }}
        />
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Notifications are ranked by Weight (Placement &gt; Result &gt; Event) and Recency.
      </Alert>

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {notifications.length === 0 && <Alert severity="info">No priority notifications found.</Alert>}
          {notifications.map((n, index) => (
            <Card 
              key={n.ID} 
              sx={{ 
                position: 'relative',
                bgcolor: index < 3 ? 'rgba(25, 118, 210, 0.04)' : 'inherit'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {n.Message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(n.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                    <Chip 
                      label={n.Type} 
                      size="small" 
                      color={getTypeColor(n.Type) as any} 
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PriorityInbox;
