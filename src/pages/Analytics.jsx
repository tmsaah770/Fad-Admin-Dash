import { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Home,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { reportsService } from '../services/reportsService';
import { dashboardService } from '../services/dashboardService';
import { parkingsService } from '../services/parkingsService';
import './Analytics.css';

const iconMap = {
  DollarSign,
  Calendar,
  TrendingUp,
  Home,
};

const CustomTrendTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="analytics-custom-tooltip">
        <div className="analytics-tooltip-month">{label} 2026</div>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="analytics-tooltip-row"
            style={{ color: entry.color }}
          >
            <span>{entry.name === 'revenue' ? 'Revenue:' : 'Bookings:'}</span>
            <strong>
              {entry.name === 'revenue'
                ? `$${entry.value.toLocaleString()}`
                : `${entry.value.toLocaleString()} spots`}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState([
    { id: 'total-revenue', icon: 'DollarSign', value: '$0', label: 'TOTAL REVENUE', iconBg: '#ECFDF3', iconColor: '#12B76A' },
    { id: 'total-bookings', icon: 'Calendar', value: '0', label: 'TOTAL BOOKINGS', iconBg: '#EEF4FF', iconColor: '#2B76F6' },
    { id: 'avg-occupancy', icon: 'TrendingUp', value: '0%', label: 'AVG OCCUPANCY', iconBg: '#F4EBFF', iconColor: '#7F56D9' },
    { id: 'active-locations', icon: 'Home', value: '0', label: 'ACTIVE LOCATIONS', iconBg: '#EEF4FF', iconColor: '#2B76F6' },
  ]);

  const [trendData, setTrendData] = useState([
    { month: 'Jan', revenue: 0, bookings: 0 },
    { month: 'Feb', revenue: 0, bookings: 0 },
    { month: 'Mar', revenue: 0, bookings: 0 },
    { month: 'Apr', revenue: 0, bookings: 0 },
    { month: 'May', revenue: 0, bookings: 0 },
    { month: 'Jun', revenue: 0, bookings: 0 },
  ]);

  const [ownerRevenue, setOwnerRevenue] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        const [summaryRes, ownersRes, revenueRes] = await Promise.allSettled([
          dashboardService.getSummary(),
          import('../services/ownersService').then(m => m.ownersService.getOwners()),
          dashboardService.getRevenue('monthly'),
        ]);

        if (!isMounted) return;

        let summary = {};
        if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
          summary = summaryRes.value.data;
        }

        const totalRev = summary.totalRevenue ?? summary.todayRevenue ?? 0;
        const totalBookings = summary.totalBookings ?? summary.todayBookingsCount ?? 0;
        const occupancy = summary.occupancyPercentage ?? 0;

        let ownersList = [];
        if (ownersRes.status === 'fulfilled' && ownersRes.value?.data) {
          ownersList = Array.isArray(ownersRes.value.data) ? ownersRes.value.data : (ownersRes.value.data.items || []);
        }

        setStats([
          { id: 'total-revenue', icon: 'DollarSign', value: `$${totalRev.toLocaleString()}`, label: 'TOTAL REVENUE', iconBg: '#ECFDF3', iconColor: '#12B76A' },
          { id: 'total-bookings', icon: 'Calendar', value: String(totalBookings), label: 'TOTAL BOOKINGS', iconBg: '#EEF4FF', iconColor: '#2B76F6' },
          { id: 'avg-occupancy', icon: 'TrendingUp', value: `${occupancy}%`, label: 'AVG OCCUPANCY', iconBg: '#F4EBFF', iconColor: '#7F56D9' },
          { id: 'active-locations', icon: 'Home', value: String(ownersList.reduce((acc, o) => acc + (o.totalLocations || 0), 0)), label: 'ACTIVE LOCATIONS', iconBg: '#EEF4FF', iconColor: '#2B76F6' },
        ]);

        // Real trend data if provided by API
        if (revenueRes.status === 'fulfilled' && Array.isArray(revenueRes.value?.data?.dataPoints) && revenueRes.value.data.dataPoints.length > 0) {
          const mappedTrend = revenueRes.value.data.dataPoints.map((dp) => ({
            month: dp.label || 'Mo',
            revenue: dp.revenue || 0,
            bookings: dp.bookings || 0,
          }));
          setTrendData(mappedTrend);
        }

        // Real owners data
        const maxRev = Math.max(...ownersList.map(o => o.totalRevenue || 0), 1);
        const revOwners = ownersList.map((o, idx) => ({
          name: o.fullName || o.userName || `Owner ${idx + 1}`,
          locations: `${o.totalLocations || 0} locations`,
          revenue: `$${(o.totalRevenue || 0).toLocaleString()}`,
          pct: Math.round(((o.totalRevenue || 0) / maxRev) * 100),
          color: ['#2B76F6', '#12B76A', '#7F56D9', '#F79009'][idx % 4],
        }));
        setOwnerRevenue(revOwners.sort((a,b) => b.pct - a.pct).slice(0, 5));

        const bookOwners = ownersList.map((o, idx) => ({
          name: o.fullName || o.userName || `Owner ${idx + 1}`,
          bookings: o.totalBookings || Math.floor((o.totalRevenue || 0) / 10) || 0,
        }));
        setOwnerBookings(bookOwners.sort((a,b) => b.bookings - a.bookings).slice(0, 5));

      } catch (err) {
        console.error('[Analytics] Error:', err.message);
      }
    }

    loadAnalytics();
    return () => { isMounted = false; };
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      // Call live backend GET /api/reports/revenue/export
      const blob = await reportsService.exportRevenueCsv();
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `parkly_revenue_report_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }
    } catch (err) {
      console.warn('[Analytics] Backend CSV export error:', err.message);
    } finally {
      setExporting(false);
    }

    // Client export from live data
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Month,Revenue,Bookings', ...trendData.map((r) => `${r.month},${r.revenue},${r.bookings}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'parkly_analytics_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-page" id="analytics-page">
      {/* Page Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">Reports & Analytics</h1>
          <p className="analytics-subtitle">
            Platform-wide performance metrics and revenue breakdown
          </p>
        </div>

        <div className="analytics-actions">
          <div className="analytics-time-group">
            {['This Week', 'This Month', 'Last 6 Months'].map((t) => (
              <button
                key={t}
                className={`analytics-time-btn ${timeframe === t ? 'active' : ''}`}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            className="analytics-export-btn"
            onClick={handleExportCSV}
            disabled={exporting}
          >
            <Download size={14} strokeWidth={2} />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-stats-grid">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.id} className="analytics-stat-card">
              <div className="analytics-stat-top">
                <div
                  className="analytics-stat-icon"
                  style={{ background: stat.iconBg }}
                >
                  {Icon && (
                    <Icon
                      size={20}
                      strokeWidth={2.2}
                      style={{ color: stat.iconColor }}
                    />
                  )}
                </div>
                {stat.badge && (
                  <span className="analytics-stat-badge">
                    ↑ {stat.badge}
                  </span>
                )}
              </div>
              <div className="analytics-stat-value">{stat.value}</div>
              <div className="analytics-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Large Trend Chart */}
      <div className="analytics-chart-card">
        <div className="analytics-chart-header">
          <h3 className="analytics-chart-title">Revenue & Bookings Trend</h3>
          <p className="analytics-chart-sub">Monthly breakdown — 2026</p>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="analyticsRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2B76F6" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#2B76F6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F2F4F7"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A94A6', fontSize: 12 }}
                dy={8}
              />
              <YAxis
                yAxisId="revenue"
                domain={[0, 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A94A6', fontSize: 12 }}
                width={50}
              />
              <YAxis
                yAxisId="bookings"
                orientation="right"
                domain={[0, 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A94A6', fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#2B76F6"
                strokeWidth={2.5}
                fill="url(#analyticsRevenueGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#2B76F6',
                  stroke: '#fff',
                  strokeWidth: 3,
                }}
              />
              <Line
                yAxisId="bookings"
                type="monotone"
                dataKey="bookings"
                stroke="#12B76A"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: '#fff',
                  stroke: '#12B76A',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#12B76A',
                  stroke: '#fff',
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="analytics-chart-legend">
          <div className="analytics-legend-item">
            <span
              className="analytics-legend-dot"
              style={{ background: '#12B76A' }}
            ></span>
            <span style={{ color: '#101828' }}>Bookings</span>
          </div>
          <div className="analytics-legend-item">
            <span
              className="analytics-legend-dot"
              style={{ background: '#2B76F6' }}
            ></span>
            <span style={{ color: '#101828' }}>Revenue ($)</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: 2 Cards */}
      <div className="analytics-bottom-grid">
        {/* Left Card: Revenue by Owner */}
        <div className="analytics-revenue-card">
          <div>
            <h3 className="analytics-chart-title">Revenue by Owner</h3>
          </div>

          <div className="analytics-revenue-list">
            {ownerRevenue.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9A9FA5', padding: '32px 0', fontSize: '13px' }}>No revenue recorded yet</p>
            ) : (
              ownerRevenue.map((owner, idx) => (
                <div key={idx} className="analytics-revenue-item">
                  <div className="analytics-revenue-top">
                    <span className="analytics-owner-name">{owner.name}</span>
                    <span className="analytics-owner-rev">{owner.revenue}</span>
                  </div>

                  <div className="analytics-progress-track">
                    <div
                      className="analytics-progress-fill"
                      style={{
                        width: `${owner.pct}%`,
                        background: owner.color,
                      }}
                    ></div>
                  </div>

                  <div className="analytics-revenue-sub">
                    <span>{owner.locations}</span>
                    <span style={{ fontWeight: 600 }}>{owner.pct}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Card: Bookings by Owner */}
        <div className="analytics-bookings-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Bookings by Owner</h3>
            <p className="analytics-chart-sub">Cumulative platform bookings</p>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ownerBookings}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F2F4F7"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 3000]}
                  ticks={[0, 750, 1500, 2250, 3000]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8A94A6', fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  tick={{ fill: '#667085', fontSize: 11.5 }}
                />
                <Tooltip
                  formatter={(val) => [
                    `${val.toLocaleString()} bookings`,
                    'Bookings',
                  ]}
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #E4E7EC',
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar
                  dataKey="bookings"
                  fill="#2B76F6"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
