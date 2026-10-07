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
        const [summaryRes, pStatsRes, uStatsRes, oStatsRes] = await Promise.allSettled([
          dashboardService.getSummary(),
          parkingsService.getStats(),
          import('../services/usersService').then(m => m.usersService.getStats()),
          import('../services/ownersService').then(m => m.ownersService.getStats())
        ]);

        if (!isMounted) return;

        let summary = {};
        if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
          summary = summaryRes.value.data;
        }
        
        let pStats = {};
        if (pStatsRes.status === 'fulfilled' && pStatsRes.value?.data) {
          pStats = pStatsRes.value.data;
        }

        let uStats = {};
        if (uStatsRes.status === 'fulfilled' && uStatsRes.value?.data) {
          uStats = uStatsRes.value.data;
        }

        let oStats = {};
        if (oStatsRes.status === 'fulfilled' && oStatsRes.value?.data) {
          oStats = oStatsRes.value.data;
        }

        const todayBookings = summary.todayBookingsCount ?? 0;
        const todayRevenue = summary.todayRevenue ?? 0;
        const occupancy = summary.occupancyPercentage ?? 0;
        const activeReservations = summary.activeReservations ?? 0;

        setRow1([
          { id: 'total-users', title: 'Total Users', value: String(uStats.totalUsers || 0), change: '0%', isPositive: true, subtext: 'Registered Drivers' },
          { id: 'active-drivers', title: 'Active Drivers', value: String(uStats.activeUsers || 0), change: '0%', isPositive: true, subtext: 'Active on platform' },
          { id: 'parking-owners', title: 'Parking Owners', value: String(oStats.totalOwners || 0), change: '0%', isPositive: true, subtext: `${oStats.activeOwners || 0} active owners` },
          { id: 'locations', title: 'Total Locations', value: String(pStats.totalLocations || 0), change: '0%', isPositive: true, subtext: `${pStats.totalSpaces || 0} total spaces` },
        ]);

        setRow2([
          { id: 'total-reservations', title: 'Today Bookings', value: String(todayBookings), change: '0%', isPositive: true, subtext: `${activeReservations} active now` },
          { id: 'daily-revenue', title: "Today's Revenue", value: `$${todayRevenue.toLocaleString()}`, change: '0%', isPositive: true, subtext: 'Gross revenue today' },
          { id: 'network-revenue', title: 'Total Network Revenue', value: `$${(pStats.networkRevenue || 0).toLocaleString()}`, change: '0%', isPositive: true, subtext: 'Platform processed' },
          { id: 'avg-occupancy', title: 'Avg Occupancy', value: `${occupancy}%`, change: '0%', isPositive: true, subtext: `${pStats.totalSpaces || 0} spaces live` },
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
