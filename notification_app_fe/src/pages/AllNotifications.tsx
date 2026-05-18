import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Pagination,
  CircularProgress,
  Stack,
  Alert
} from '@mui/material';
import { getNotifications, type Notification } from '../services/notificationService';

const AllNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const data = localStorage.getItem('viewed');
    if (data) setViewed(new Set(JSON.parse(data)));
  }, []);

  useEffect(() => {
    fetchData();
  }, [type, page]);

  const fetchData = async () => {
    setLoading(true);
    const data = await getNotifications({ 
      limit: 10, 
      page, 
      notification_type: type || undefined 
    });
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsViewed = (id: string) => {
    const next = new Set(viewed);
    next.add(id);
    setViewed(next);
    localStorage.setItem('viewed', JSON.stringify([...next]));
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
        <Typography variant="h5">Feed</Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={type}
            label="Filter by Type"
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {notifications.length === 0 && <Alert severity="info">No notifications found.</Alert>}
          {notifications.map((n) => (
            <Card 
              key={n.ID} 
              onMouseEnter={() => markAsViewed(n.ID)}
              sx={{ 
                borderLeft: viewed.has(n.ID) ? 'none' : '5px solid #1976d2',
                opacity: viewed.has(n.ID) ? 0.8 : 1
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={viewed.has(n.ID) ? 400 : 600}>
                      {n.Message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(n.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={n.Type} 
                    size="small" 
                    color={getTypeColor(n.Type) as any} 
                    variant={viewed.has(n.ID) ? "outlined" : "filled"}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
          
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={10} 
              page={page} 
              onChange={(_, value) => setPage(value)} 
              color="primary" 
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default AllNotifications;
