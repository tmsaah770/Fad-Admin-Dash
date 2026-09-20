import {
  Users, CarFront, MapPin, CalendarCheck, CheckCircle,
  DollarSign, BarChart3, Bell
} from 'lucide-react';
import './StatsCard.css';

const iconMap = {
  Users, CarFront, MapPin, CalendarCheck, CheckCircle,
  DollarSign, BarChart3, Bell,
};

export default function StatsCard({ icon, value, label, subtext, trend, trendUp, iconBg, iconColor }) {
  const Icon = iconMap[icon];

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ background: iconBg }}>
          {Icon && <Icon size={20} strokeWidth={1.8} style={{ color: iconColor }} />}
        </div>
        {trend && (
          <span className={`stats-card-trend ${trendUp === true ? 'up' : trendUp === false ? 'down' : 'neutral'}`}>
            {trendUp === true && '↑'}{trend}
          </span>
        )}
      </div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-label">{label}</div>
      {subtext && <div className="stats-card-subtext">{subtext}</div>}
    </div>
  );
}
