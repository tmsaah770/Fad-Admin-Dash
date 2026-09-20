import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import ParkingOwners from './pages/ParkingOwners';
import Locations from './pages/Locations';
import Reservations from './pages/Reservations';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login — standalone (no sidebar/header) */}
        <Route path="/login" element={<Login />} />

        {/* Strictly Protected Dashboard pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/parking-owners" element={<ParkingOwners />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all: redirect unauthenticated users to /login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
