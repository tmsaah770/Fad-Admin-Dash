import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { revenueChartData } from '../data/mockData';
import { dashboardService } from '../services/dashboardService';
import './RevenueChart.css';

const formatCurrency = (value) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="revenue-tooltip">
        <p className="revenue-tooltip-label">{label}</p>
        <p className="revenue-tooltip-value">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const initialChartData = [
  { month: 'Jan', revenue: 0 },
  { month: 'Feb', revenue: 0 },
  { month: 'Mar', revenue: 0 },
  { month: 'Apr', revenue: 0 },
  { month: 'May', revenue: 0 },
  { month: 'Jun', revenue: 0 },
];

export default function RevenueChart() {
  const [chartData, setChartData] = useState(initialChartData);
  const [totalRevenueText, setTotalRevenueText] = useState('$0');

  useEffect(() => {
    let isMounted = true;
    async function loadRevenueData() {
      try {
        const res = await dashboardService.getRevenue('monthly');
        if (isMounted && res?.data) {
          if (Array.isArray(res.data.dataPoints) && res.data.dataPoints.length > 0) {
            const mapped = res.data.dataPoints.map((dp) => ({
              month: dp.label || dp.periodName || 'Mo',
              revenue: dp.revenue || dp.amount || 0,
            }));
            setChartData(mapped);
          }
          const total = res.data.totalRevenue ?? 0;
          setTotalRevenueText(`$${total.toLocaleString()}`);
        }
      } catch (err) {
        console.warn('[RevenueChart] Error:', err.message);
      }
    }
    loadRevenueData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="revenue-chart-card" id="revenue-chart">
      <div className="revenue-chart-header">
        <div>
          <h3 className="revenue-chart-title">Platform Revenue</h3>
          <p className="revenue-chart-subtitle">Monthly trend — Jan to Aug 2026</p>
        </div>
        <span className="revenue-chart-total">{totalRevenueText}</span>
      </div>
      <div className="revenue-chart-body">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2B76F6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#2B76F6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F0F2F5"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#9A9FA5' }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#9A9FA5' }}
              axisLine={false}
              tickLine={false}
              dx={-8}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2B76F6"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#2B76F6',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
