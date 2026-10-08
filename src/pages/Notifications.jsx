import { useState, useEffect } from 'react';
import {
  User,
  Home,
  Calendar,
  X,
  Zap,
  MapPin,
  Check,
} from 'lucide-react';
import { notificationsService } from '../services/notificationsService';
import './Notifications.css';

const iconMap = {
  User,
  Home,
  Calendar,
  X,
  Zap,
  MapPin,
};

const initialNotifStats = [
  { id: 'total', label: 'TOTAL NOTIFICATIONS', value: '0', icon: 'Zap', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
  { id: 'unread', label: 'UNREAD ALERTS', value: '0', icon: 'Zap', iconColor: '#D92D20', iconBg: '#FEF3F2' },
  { id: 'users', label: 'USER EVENTS', value: '0', icon: 'User', iconColor: '#12B76A', iconBg: '#ECFDF3' },
  { id: 'reservations', label: 'RESERVATIONS', value: '0', icon: 'Calendar', iconColor: '#7F56D9', iconBg: '#F4EBFF' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState(initialNotifStats);

  // Fetch live notifications from Parkly API: GET /api/Notifications
  useEffect(() => {
    let isMounted = true;
    async function fetchNotificationsData() {
      try {
        const notifsRes = await notificationsService.getNotifications(1, 50);

        if (!isMounted) return;

        const items = notifsRes?.data?.items || notifsRes?.data || notifsRes?.items || (Array.isArray(notifsRes) ? notifsRes : []);
        if (Array.isArray(items)) {
          const apiItems = items.map((item, idx) => {
            const typeStr = item.type ? String(item.type) : 'alert';
            return {
              id: item.id || item.notificationId || idx + 200,
              title: item.title || 'Platform Notification',
              description: item.message || item.body || 'System alert.',
              time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              category: typeStr.toLowerCase(),
              unread: !item.isRead,
              icon: typeStr === 'User' ? 'User' : typeStr === 'Reservation' ? 'Calendar' : 'Zap',
              iconBg: typeStr === 'User' ? '#EEF4FF' : '#FFF4E5',
              iconColor: typeStr === 'User' ? '#2B76F6' : '#F79009',
            };
          });
          setNotifications(apiItems);

          const unreadCount = apiItems.filter((n) => n.unread).length;
          const userCount = apiItems.filter((n) => n.category === 'user').length;
          const resCount = apiItems.filter((n) => n.category === 'reservation').length;

          setStats([
            { id: 'total', label: 'TOTAL NOTIFICATIONS', value: String(apiItems.length), icon: 'Zap', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
            { id: 'unread', label: 'UNREAD ALERTS', value: String(unreadCount), icon: 'Zap', iconColor: '#D92D20', iconBg: '#FEF3F2' },
            { id: 'users', label: 'USER EVENTS', value: String(userCount), icon: 'User', iconColor: '#12B76A', iconBg: '#ECFDF3' },
            { id: 'reservations', label: 'RESERVATIONS', value: String(resCount), icon: 'Calendar', iconColor: '#7F56D9', iconBg: '#F4EBFF' },
          ]);
        }
      } catch (err) {
        console.warn('[Notifications] Error:', err.message);
      }
    }

    fetchNotificationsData();
    return () => { isMounted = false; };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { unreadCount: 0 } }));
    try {
      // Call live backend PATCH /api/Notifications/read-all
      await notificationsService.markAllAsRead();
    } catch (err) {
      console.warn('Backend mark-all-read:', err.message);
    }
  };

  const handleToggleRead = async (id) => {
    let nextCount = 0;
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n));
      nextCount = updated.filter((n) => n.unread).length;
      return updated;
    });
    window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { unreadCount: nextCount } }));
    try {
      // Call live backend PATCH /api/Notifications/{id}/read
      await notificationsService.markAsRead(id);
    } catch (err) {
      console.warn('Backend mark-read:', err.message);
    }
  };

  const filterTabs = [
    { id: 'all', label: 'All', count: unreadCount },
    {
      id: 'driver',
      label: 'Driver',
      count: notifications.filter((n) => n.category === 'driver' && n.unread).length,
    },
    {
      id: 'owner',
      label: 'Owner',
      count: notifications.filter((n) => n.category === 'owner' && n.unread).length,
    },
    {
      id: 'reservation',
      label: 'Reservation',
      count: notifications.filter((n) => n.category === 'reservation' && n.unread).length,
    },
    {
      id: 'cancellation',
      label: 'Cancellation',
      count: notifications.filter((n) => n.category === 'cancellation' && n.unread).length,
    },
    {
      id: 'alert',
      label: 'Alert',
      count: notifications.filter((n) => n.category === 'alert').length,
    },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  return (
    <div className="notifications-page" id="notifications-page">
      {/* Page Header */}
      <div className="notifications-header">
        <div>
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread platform alerts`
              : 'All notifications caught up'}
          </p>
        </div>

        <button
          className="notifications-mark-read-btn"
          onClick={handleMarkAllAsRead}
        >
          <Check size={15} strokeWidth={2.2} />
          Mark All as Read
        </button>
      </div>

      {/* 5 Stats Cards */}
      <div className="notifications-stats-grid">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.id} className="notifications-stat-card">
              <div
                className="notifications-stat-icon"
                style={{ background: stat.iconBg }}
              >
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={stat.icon === 'X' ? 2.5 : 2}
                    style={{ color: stat.iconColor }}
                  />
                )}
              </div>
              <div className="notifications-stat-value">{stat.value}</div>
              <div className="notifications-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs Card */}
      <div className="notifications-filter-card">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`notifications-filter-btn ${
              activeTab === tab.id ? 'active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="notifications-filter-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="notifications-list-card">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.id}
                className={`notification-item ${item.unread ? 'unread' : ''}`}
                onClick={() => handleToggleRead(item.id)}
                title="Click to toggle read state"
              >
                <div className="notification-left">
                  <div
                    className="notification-icon-box"
                    style={{ background: item.iconBg }}
                  >
                    {Icon && (
                      <Icon
                        size={18}
                        strokeWidth={item.icon === 'X' ? 2.5 : 2}
                        style={{ color: item.iconColor }}
                      />
                    )}
                  </div>
                  <div className="notification-text-box">
                    <span className="notification-item-title">{item.title}</span>
                    <span className="notification-item-desc">{item.description}</span>
                  </div>
                </div>

                <div className="notification-right">
                  {item.unread && <span className="notification-unread-dot"></span>}
                  <span className="notification-time">{item.time}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="notifications-empty-state">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
