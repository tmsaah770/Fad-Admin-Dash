import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CarFront,
  MapPin,
  CalendarDays,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { navItems } from '../data/mockData';
import { authService } from '../services/authService';
import { notificationsService } from '../services/notificationsService';
import './Sidebar.css';

const iconMap = {
  LayoutDashboard,
  Users,
  CarFront,
  MapPin,
  CalendarDays,
  BarChart3,
  Bell,
  Settings,
};

import logoImg from '../assets/dash-logo.jpeg';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch real unread notifications count from API
  useEffect(() => {
    let isMounted = true;
    async function loadNotifCount() {
      try {
        const res = await notificationsService.getSummary();
        if (isMounted) {
          const count = res?.data?.unreadCount ?? res?.unreadCount;
          if (typeof count === 'number') {
            setUnreadCount(count);
            return;
          }
        }
      } catch (err) {
        console.warn('[Sidebar] Notification summary load error:', err.message);
      }

      // Fallback: check notification items directly
      try {
        const listRes = await notificationsService.getNotifications(1, 20);
        if (isMounted) {
          const items = listRes?.data?.items || listRes?.data || [];
          if (Array.isArray(items)) {
            const count = items.filter((n) => !n.isRead).length;
            setUnreadCount(count);
          }
        }
      } catch {
        if (isMounted) setUnreadCount(0);
      }
    }

    loadNotifCount();

    const handleUpdate = (e) => {
      if (typeof e?.detail?.unreadCount === 'number') {
        setUnreadCount(e.detail.unreadCount);
      } else {
        loadNotifCount();
      }
    };
    window.addEventListener('notificationsUpdated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('notificationsUpdated', handleUpdate);
    };
  }, []);

  // Load user data if available from login response
  let currentUser = { fullName: 'Super Admin', role: 'Platform Administrator' };
  try {
    const stored = localStorage.getItem('parkly_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      currentUser = {
        fullName: parsed.fullName || parsed.userName || parsed.email || 'Super Admin',
        role: parsed.role || 'Platform Administrator',
      };
    }
  } catch {
    // fallback
  }

  const initials = currentUser.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SA';

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logoImg} alt="Parkly Logo" className="sidebar-logo-img" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s+&?\s*/g, '-')}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="sidebar-nav-label">{item.label}</span>
              {item.path === '/notifications' && (
                <span className="sidebar-nav-badge">{unreadCount}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-avatar">{initials}</div>
        <div className="sidebar-profile-info">
          <span className="sidebar-profile-name">{currentUser.fullName}</span>
          <span className="sidebar-profile-role">{currentUser.role}</span>
        </div>
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Sign Out"
          id="sidebar-logout-btn"
        >
          <LogOut size={18} strokeWidth={1.8} />
        </button>
      </div>
    </aside>
  );
}
