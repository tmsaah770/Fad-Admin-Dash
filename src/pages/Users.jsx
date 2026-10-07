import { useState, useEffect } from 'react';
import {
  Search, CheckCircle, Bell, XCircle, SlidersHorizontal, Eye, Users as UsersIcon
} from 'lucide-react';
import { usersService } from '../services/usersService';
import './Users.css';

const iconMap = { CheckCircle, Bell, XCircle };
const statusFilters = ['All Statuses', 'Active', 'Pending', 'Suspended'];

export default function Users() {
  const [activeFilter, setActiveFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [usersRes, statsRes] = await Promise.allSettled([
          usersService.getUsers(),
          usersService.getStats()
        ]);
        
        if (!isMounted) return;

        if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
          const rawData = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data.items || []);
          const mapped = rawData.map(u => ({
            id: u.id || Math.random().toString(),
            name: u.fullName || u.userName || 'Unknown User',
            email: u.email || 'No email',
            phone: u.phoneNumber || 'N/A',
            registered: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
            reservations: u.bookings || 0,
            spent: u.totalSpent ? `$${u.totalSpent}` : '$0',
            lastActive: u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Recently',
            status: u.status ? u.status.toLowerCase() : 'active',
            initials: (u.fullName || u.userName || 'U').slice(0, 2).toUpperCase(),
            color: '#2B76F6'
          }));
          setUsersList(mapped);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
           const s = statsRes.value.data;
           setStats({
             total: s.totalUsers ?? 0,
             active: s.activeUsers ?? 0,
             pending: s.pendingUsers ?? 0,
             suspended: s.suspendedUsers ?? 0,
           });
        }
      } catch (e) {
        console.error('Failed to load users:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredUsers = usersList.filter((user) => {
    const matchesFilter =
      activeFilter === 'All Statuses' ||
      user.status?.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const realStats = [
    { id: 'total', label: 'TOTAL DRIVERS', value: String(stats.total), icon: 'CheckCircle', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
    { id: 'active', label: 'ACTIVE', value: String(stats.active), icon: 'CheckCircle', iconColor: '#12B76A', iconBg: '#ECFDF3' },
    { id: 'pending', label: 'PENDING', value: String(stats.pending), icon: 'Bell', iconColor: '#F79009', iconBg: '#FFF4E5' },
    { id: 'suspended', label: 'SUSPENDED', value: String(stats.suspended), icon: 'XCircle', iconColor: '#D92D20', iconBg: '#FEF3F2' },
  ];

  return (
    <div className="users-page" id="users-page">
      {/* Page Header */}
      <div className="users-page-header">
        <div>
          <h1 className="users-page-title">Users Management</h1>
          <p className="users-page-subtitle">{stats.total} registered drivers on the platform</p>
        </div>
        <div className="users-search">
          <Search size={16} strokeWidth={1.8} className="users-search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            className="users-search-input"
            id="users-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="users-stats-grid">
        {realStats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.id} className="users-stat-card">
              <div className="users-stat-icon" style={{ background: stat.iconBg }}>
                {Icon && <Icon size={20} strokeWidth={2} style={{ color: stat.iconColor }} />}
              </div>
              <div className="users-stat-value">{stat.value}</div>
              <div className="users-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs + Table */}
      <div className="users-table-card">
        {/* Filter Bar */}
        <div className="users-filter-bar">
          <SlidersHorizontal size={16} strokeWidth={1.8} className="users-filter-icon" />
          {statusFilters.map((filter) => (
            <button
              key={filter}
              className={`users-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="users-table-wrapper">
          <table className="users-table" id="users-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>REGISTERED</th>
                <th>RESERVATIONS</th>
                <th>SPENT</th>
                <th>LAST ACTIVE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '48px 16px', color: '#6F767E' }}>
                    <UsersIcon size={36} color="#9A9FA5" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D1F', margin: '0 0 4px 0' }}>No Registered Drivers Found</p>
                    <span style={{ fontSize: '13px', color: '#9A9FA5' }}>Driver accounts will appear here once registered via the mobile application or API.</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users-table-user">
                        <div className="users-table-avatar" style={{ background: user.color }}>
                          {user.initials}
                        </div>
                        <span className="users-table-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="users-table-email">{user.email}</td>
                    <td className="users-table-phone">{user.phone}</td>
                    <td>{user.registered}</td>
                    <td>{user.reservations}</td>
                    <td className="users-table-spent">{user.spent}</td>
                    <td>{user.lastActive}</td>
                    <td>
                      <span className={`users-table-status ${user.status}`}>
                        <span className="users-table-status-dot"></span>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="users-table-view-btn" id={`view-user-${user.id}`}>
                        <Eye size={14} strokeWidth={1.8} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

