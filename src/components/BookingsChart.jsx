import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import './BookingsChart.css';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const initialWeeklyData = daysOfWeek.map((day) => ({ day, bookings: 0 }));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bookings-tooltip">
        <p className="bookings-tooltip-label">{label}</p>
        <p className="bookings-tooltip-value">{payload[0].value} bookings</p>
      </div>
    );
  }
  return null;
};

export default function BookingsChart() {
  const [chartData, setChartData] = useState(initialWeeklyData);

  useEffect(() => {
    let isMounted = true;
    async function loadBookings() {
      try {
        const res = await dashboardService.getRevenue('weekly');
        if (isMounted && res?.data?.dataPoints?.length) {
          const mapped = res.data.dataPoints.map((dp, idx) => ({
            day: dp.label || daysOfWeek[idx % 7],
            bookings: dp.bookings || dp.count || 0,
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.warn('[BookingsChart] Error:', err.message);
      }
    }
    loadBookings();
    return () => { isMounted = false; };
  }, []);
  return (
    <div className="bookings-chart-card" id="bookings-chart">
      <div className="bookings-chart-header">
        <h3 className="bookings-chart-title">Bookings This Week</h3>
        <p className="bookings-chart-subtitle">Daily booking volume</p>
      </div>
      <div className="bookings-chart-body">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#9A9FA5' }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9A9FA5' }}
              axisLine={false}
              tickLine={false}
              dx={-8}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(43,118,246,0.05)' }} />
            <Bar
              dataKey="bookings"
              fill="#2B76F6"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
