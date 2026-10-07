import { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import BookingsChart from '../components/BookingsChart';
import RecentActivity from '../components/RecentActivity';
import PendingApprovals from '../components/PendingApprovals';
import { dashboardService } from '../services/dashboardService';
import { parkingsService } from '../services/parkingsService';
import './Dashboard.css';

const initialRow1 = [
  { id: 'total-users', title: 'Total Users', value: '0', change: '0%', isPositive: true, subtext: 'Registered Drivers' },
  { id: 'active-drivers', title: 'Active Drivers', value: '0', change: '0%', isPositive: true, subtext: 'Active on platform' },
  { id: 'parking-owners', title: 'Parking Owners', value: '0', change: '0%', isPositive: true, subtext: 'Registered facility owners' },
  { id: 'locations', title: 'Total Locations', value: '0', change: '0%', isPositive: true, subtext: '0 total spaces' },
];

const initialRow2 = [
  { id: 'total-reservations', title: 'Today Bookings', value: '0', change: '0%', isPositive: true, subtext: '0 active reservations' },
  { id: 'daily-revenue', title: "Today's Revenue", value: '$0', change: '0%', isPositive: true, subtext: 'Gross revenue' },
  { id: 'network-revenue', title: 'Total Network Revenue', value: '$0', change: '0%', isPositive: true, subtext: 'Platform processed' },
  { id: 'avg-occupancy', title: 'Avg Occupancy', value: '0%', change: '0%', isPositive: true, subtext: 'Across all spaces' },
];

export default function Dashboard() {
  const [row1, setRow1] = useState(initialRow1);
  const [row2, setRow2] = useState(initialRow2);

  // Fetch live metrics from real API: /api/Dashboard/summary & /api/Parkings
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [usersRes, ownersRes, parkingsRes, resRes, summaryRes] = await Promise.allSettled([
          import('../services/usersService').then(m => m.usersService.getUsers()),
          import('../services/ownersService').then(m => m.ownersService.getOwners()),
          parkingsService.getParkings(),
          import('../services/reservationsService').then(m => m.reservationsService.getReservations()),
          dashboardService.getSummary()
        ]);

        if (!isMounted) return;

        let usersList = usersRes.status === 'fulfilled' && usersRes.value?.data ? (Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data.items || [])) : [];
        let ownersList = ownersRes.status === 'fulfilled' && ownersRes.value?.data ? (Array.isArray(ownersRes.value.data) ? ownersRes.value.data : (ownersRes.value.data.items || [])) : [];
        let parkingsList = parkingsRes.status === 'fulfilled' && parkingsRes.value?.data ? (Array.isArray(parkingsRes.value.data) ? parkingsRes.value.data : (parkingsRes.value.data.items || [])) : [];
        let resList = resRes.status === 'fulfilled' && resRes.value?.data ? (Array.isArray(resRes.value.data) ? resRes.value.data : (resRes.value.data.items || [])) : [];

        const activeUsers = usersList.filter(u => u.status?.toLowerCase() === 'active').length;
        const activeOwners = ownersList.filter(o => o.status?.toLowerCase() === 'active').length;

        let totalSpaces = 0;
        let availableSpaces = 0;
        parkingsList.forEach(p => {
          totalSpaces += (p.totalSpaces || 0);
          availableSpaces += (p.availableSpaces ?? p.totalSpaces ?? 0);
        });

        const occupiedSpaces = totalSpaces - availableSpaces;
        const occupancy = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;

        const networkRev = resList.reduce((acc, r) => acc + (r.totalPrice || 0), 0) || ownersList.reduce((acc, o) => acc + (o.totalRevenue || 0), 0);
        const activeReservations = resList.filter(r => r.status?.toLowerCase() === 'active').length;

        let summary = summaryRes.status === 'fulfilled' && summaryRes.value?.data ? summaryRes.value.data : {};
        const todayBookings = summary.todayBookingsCount || Math.max(resList.length, 0); 
        const todayRevenue = summary.todayRevenue || Math.max(networkRev, 0);

        setRow1([
          { id: 'total-users', title: 'Total Users', value: String(usersList.length), change: '0%', isPositive: true, subtext: 'Registered Drivers' },
          { id: 'active-drivers', title: 'Active Drivers', value: String(activeUsers), change: '0%', isPositive: true, subtext: 'Active on platform' },
          { id: 'parking-owners', title: 'Parking Owners', value: String(ownersList.length), change: '0%', isPositive: true, subtext: `${activeOwners} active owners` },
          { id: 'locations', title: 'Total Locations', value: String(parkingsList.length), change: '0%', isPositive: true, subtext: `${totalSpaces} total spaces` },
        ]);

        setRow2([
          { id: 'total-reservations', title: 'Total Bookings', value: String(todayBookings), change: '0%', isPositive: true, subtext: `${activeReservations} active now` },
          { id: 'daily-revenue', title: "Total Revenue", value: `$${todayRevenue.toLocaleString()}`, change: '0%', isPositive: true, subtext: 'Platform gross revenue' },
          { id: 'network-revenue', title: 'Network Revenue', value: `$${networkRev.toLocaleString()}`, change: '0%', isPositive: true, subtext: 'Total processed' },
          { id: 'avg-occupancy', title: 'Avg Occupancy', value: `${occupancy}%`, change: '0%', isPositive: true, subtext: `${totalSpaces} spaces live` },
        ]);
      } catch (err) {
        console.error('[Dashboard] Live data load error:', err.message);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page" id="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Platform Overview</h1>
        <p className="dashboard-page-subtitle">
          Real-time performance snapshot across all users, owners, and locations
        </p>
      </div>

      {/* Stats Row 1 */}
      <div className="dashboard-stats-grid">
        {row1.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Stats Row 2 */}
      <div className="dashboard-stats-grid">
        {row2.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-row">
        <RevenueChart />
        <BookingsChart />
      </div>

      {/* Bottom Widgets */}
      <div className="dashboard-bottom-row">
        <RecentActivity />
        <PendingApprovals />
      </div>
    </div>
  );
}
