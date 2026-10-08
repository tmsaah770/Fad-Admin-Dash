import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { authService } from '../services/authService';
import { notificationsService } from '../services/notificationsService';
import './Header.css';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch real unread notifications
  useEffect(() => {
    let isMounted = true;
    async function loadNotifs() {
      try {
        const res = await notificationsService.getSummary();
        if (isMounted) {
          const count = res?.data?.unreadCount ?? res?.unreadCount;
          if (typeof count === 'number') {
            setUnreadCount(count);
            return;
          }
        }
      } catch {
        // fallback
      }

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

    loadNotifs();

    const updateHandler = (e) => {
      if (typeof e?.detail?.unreadCount === 'number') {
        setUnreadCount(e.detail.unreadCount);
      } else {
        loadNotifs();
      }
    };
    window.addEventListener('notificationsUpdated', updateHandler);
    return () => {
      isMounted = false;
      window.removeEventListener('notificationsUpdated', updateHandler);
    };
  }, []);

  // Load user data if available from login response
  let currentUser = { fullName: 'Super Admin', role: 'Platform Administrator', email: 'admin@parkly.com' };
  try {
    const stored = localStorage.getItem('parkly_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      currentUser = {
        fullName: parsed.fullName || parsed.userName || parsed.email || 'Super Admin',
        role: parsed.role || 'Platform Administrator',
        email: parsed.email || 'admin@parkly.com',
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header" id="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} strokeWidth={1.8} />
        </button>
        {/* Search Bar */}
        <div className="header-search">
          <Search size={18} strokeWidth={1.8} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="header-search-input"
            id="header-search-input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Notification Bell */}
        <button
          className="header-notification"
          id="header-notification-btn"
          onClick={() => navigate('/notifications')}
          title="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="header-notification-badge">{unreadCount}</span>
          )}
        </button>

        {/* Profile with Dropdown */}
        <div className="header-profile-wrapper" ref={dropdownRef}>
          <div
            className="header-profile"
            id="header-profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="header-profile-avatar">{initials}</div>
            <div className="header-profile-info">
              <span className="header-profile-name">{currentUser.fullName}</span>
              <span className="header-profile-role">{currentUser.role}</span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="header-profile-chevron"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#6F767E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="header-profile-dropdown" id="header-profile-dropdown">
              <div className="header-dropdown-header">
                <p className="header-dropdown-name">{currentUser.fullName}</p>
                <p className="header-dropdown-email">{currentUser.email}</p>
              </div>
              <div className="header-dropdown-divider"></div>
              <button
                className="header-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
              >
                <SettingsIcon size={16} strokeWidth={1.8} />
                <span>Settings</span>
              </button>
              <button
                className="header-dropdown-item logout"
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={16} strokeWidth={1.8} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
