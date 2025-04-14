import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { useState, Suspense } from 'react';
import LocationManager from '../components/Admin/LocationManager';
import ParkingSpotManager from '../components/Admin/ParkingSpotManager';
import FacilityManager from '../components/Admin/FacilityManager';
import PathManager from '../components/Admin/PathManager';

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1>Admin Dashboard</h1>
      
      <Tabs 
        value={tabValue} 
        onChange={handleChange}
        aria-label="Admin dashboard navigation"
      >
        <Tab label="Locations" id="admin-tab-0" aria-controls="admin-tabpanel-0" />
        <Tab label="Parking Spots" id="admin-tab-1" aria-controls="admin-tabpanel-1" />
        <Tab label="Facilities" id="admin-tab-2" aria-controls="admin-tabpanel-2" />
        <Tab label="Paths" id="admin-tab-3" aria-controls="admin-tabpanel-3" />
      </Tabs>

      
        <Suspense fallback={<CircularProgress />}>
          <TabPanel value={tabValue} index={0}>
            <LocationManager />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ParkingSpotManager />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <FacilityManager />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <PathManager />
          </TabPanel>
        </Suspense>
      
    </Box>
  );
}