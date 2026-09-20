import { useState, useEffect } from 'react';
import {
  UserPlus, FileText, Calendar, Zap, TrendingUp, Plus
} from 'lucide-react';
import { recentActivity } from '../data/mockData';
import { dashboardService } from '../services/dashboardService';
import './RecentActivity.css';

const iconMap = {
  UserPlus, FileText, Calendar, Zap, TrendingUp, Plus,
};

export default function RecentActivity() {
  const [activities, setActivities] = useState(recentActivity);

  useEffect(() => {
    let isMounted = true;
    async function loadActivity() {
      try {
        const res = await dashboardService.getActivity();
        if (isMounted && Array.isArray(res?.data) && res.data.length > 0) {
          const mapped = res.data.map((item, idx) => ({
            id: idx + 1,
            icon: item.type === 'User' ? 'UserPlus' : item.type === 'Booking' ? 'Calendar' : 'Zap',
            iconColor: '#2B76F6',
            iconBg: '#EEF4FF',
            text: item.description || 'System event occurred',
            time: item.timeAgo || new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setActivities(mapped);
        }
      } catch (err) {
        console.warn('[RecentActivity] Fallback:', err.message);
      }
    }
    loadActivity();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="recent-activity-card" id="recent-activity">
      <h3 className="recent-activity-title">Recent Activity</h3>
      <div className="recent-activity-list">
        {activities.map((item) => {
          const Icon = iconMap[item.icon] || Zap;
          return (
            <div key={item.id} className="recent-activity-item">
              <div
                className="recent-activity-icon"
                style={{ background: item.iconBg }}
              >
                <Icon size={16} strokeWidth={2} style={{ color: item.iconColor }} />
              </div>
              <div className="recent-activity-content">
                <p className="recent-activity-text">{item.text}</p>
                <span className="recent-activity-time">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
