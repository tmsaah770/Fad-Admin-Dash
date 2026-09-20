import { useState, useEffect } from 'react';
import {
  Search,
  Home,
  Check,
  Bell,
  DollarSign,
  SlidersHorizontal,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { parkingsService } from '../services/parkingsService';
import './ParkingOwners.css';

const iconMap = {
  Home,
  Check,
  Bell,
  DollarSign,
};

const statusFilters = ['All Statuses', 'Active', 'Pending', 'Suspended'];

export default function ParkingOwners() {
  const [activeFilter, setActiveFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownersList, setOwnersList] = useState([]);
  const [stats, setStats] = useState([
    { id: 'total', label: 'TOTAL OWNERS', value: '0', icon: 'Home', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
    { id: 'active', label: 'ACTIVE', value: '0', icon: 'Check', iconColor: '#12B76A', iconBg: '#ECFDF3' },
    { id: 'pending', label: 'PENDING', value: '0', icon: 'Bell', iconColor: '#F79009', iconBg: '#FFF4E5' },
    { id: 'total-revenue', label: 'TOTAL REVENUE', value: '$0', icon: 'DollarSign', iconColor: '#12B76A', iconBg: '#ECFDF3' },
  ]);

  useEffect(() => {
    let isMounted = true;
    async function loadOwners() {
      try {
        const res = await parkingsService.getParkings();
        if (isMounted && Array.isArray(res?.data)) {
          const ownerMap = {};
          res.data.forEach((p, idx) => {
            const oId = p.ownerId || `owner-${idx}`;
            if (!ownerMap[oId]) {
              ownerMap[oId] = {
                id: oId,
                name: `Owner ${oId.slice(0, 8)}`,
                business: p.name || 'Commercial Parking Facility',
                email: `owner_${oId.slice(0, 6)}@parkly.com`,
                phone: '+20 100 000 0000',
                registered: 'Live Registered',
                locations: 0,
                spaces: 0,
                revenue: '$0',
                status: p.isOpenNow ? 'active' : 'active',
                initials: (p.name || 'PO').slice(0, 2).toUpperCase(),
                color: '#2B76F6',
              };
            }
            ownerMap[oId].locations += 1;
            ownerMap[oId].spaces += Number(p.totalSpaces) || 0;
          });

          const list = Object.values(ownerMap);
          setOwnersList(list);

          const activeCount = list.filter((o) => o.status === 'active').length;
          setStats([
            { id: 'total', label: 'TOTAL OWNERS', value: String(list.length), icon: 'Home', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
            { id: 'active', label: 'ACTIVE', value: String(activeCount), icon: 'Check', iconColor: '#12B76A', iconBg: '#ECFDF3' },
            { id: 'pending', label: 'PENDING', value: '0', icon: 'Bell', iconColor: '#F79009', iconBg: '#FFF4E5' },
            { id: 'total-revenue', label: 'TOTAL REVENUE', value: '$0', icon: 'DollarSign', iconColor: '#12B76A', iconBg: '#ECFDF3' },
          ]);
        }
      } catch (err) {
        console.warn('[ParkingOwners] Error:', err.message);
      }
    }
    loadOwners();
    return () => { isMounted = false; };
  }, []);

  const filteredOwners = ownersList.filter((owner) => {
    const matchesFilter =
      activeFilter === 'All Statuses' ||
      owner.status?.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.business?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="owners-page" id="parking-owners-page">
      {/* Page Header */}
      <div className="owners-page-header">
        <div>
          <h1 className="owners-page-title">Parking Owners</h1>
          <p className="owners-page-subtitle">{ownersList.length} registered parking businesses</p>
        </div>
        <div className="owners-search">
          <Search size={16} strokeWidth={1.8} className="owners-search-icon" />
          <input
            type="text"
            placeholder="Search owners..."
            className="owners-search-input"
            id="owners-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="owners-stats-grid">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.id} className="owners-stat-card">
              <div
                className="owners-stat-icon"
                style={{ background: stat.iconBg }}
              >
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={stat.icon === 'Check' || stat.icon === 'DollarSign' ? 2.5 : 2}
                    style={{ color: stat.iconColor }}
                  />
                )}
              </div>
              <div className="owners-stat-value">{stat.value}</div>
              <div className="owners-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs Card */}
      <div className="owners-filter-card">
        <div className="owners-filter-icon-btn">
          <SlidersHorizontal size={15} strokeWidth={2} />
        </div>
        {statusFilters.map((filter) => (
          <button
            key={filter}
            className={`owners-filter-btn ${
              activeFilter === filter ? 'active' : ''
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="owners-table-card">
        <div className="owners-table-wrapper">
          <table className="owners-table" id="owners-table">
            <thead>
              <tr>
                <th>OWNER</th>
                <th>BUSINESS</th>
                <th>EMAIL</th>
                <th>REGISTERED</th>
                <th>LOCATIONS</th>
                <th>TOTAL SPACES</th>
                <th>REVENUE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.length > 0 ? (
                filteredOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>
                      <div className="owners-table-owner">
                        <div
                          className="owners-table-avatar"
                          style={{ background: owner.color }}
                        >
                          {owner.initials}
                        </div>
                        <span className="owners-table-name">{owner.name}</span>
                      </div>
                    </td>
                    <td className="owners-table-business">{owner.business}</td>
                    <td className="owners-table-email">{owner.email}</td>
                    <td className="owners-table-registered">{owner.registered}</td>
                    <td className="owners-table-num">{owner.locations}</td>
                    <td className="owners-table-num">{owner.spaces}</td>
                    <td className="owners-table-revenue">{owner.revenue}</td>
                    <td>
                      <span className={`owners-table-status ${owner.status}`}>
                        <span className="owners-table-status-dot"></span>
                        {owner.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="owners-table-view-btn"
                        id={`view-owner-${owner.id}`}
                        onClick={() => setSelectedOwner(owner)}
                      >
                        <Eye size={13} strokeWidth={2} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="owners-table-empty">
                    No owners found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner Detail Modal */}
      {selectedOwner && (
        <div
          className="owner-modal-overlay"
          onClick={() => setSelectedOwner(null)}
        >
          <div
            className="owner-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <div className="owner-modal-profile">
                <div
                  className="owner-modal-avatar"
                  style={{ background: selectedOwner.color }}
                >
                  {selectedOwner.initials}
                </div>
                <div>
                  <h3 className="owner-modal-name">{selectedOwner.name}</h3>
                  <p className="owner-modal-biz">{selectedOwner.business}</p>
                </div>
              </div>
              <button
                className="owner-modal-close-btn"
                onClick={() => setSelectedOwner(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="owner-modal-body">
              <div className="owner-modal-grid">
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Status</div>
                  <div className="owner-modal-val">
                    <span className={`owners-table-status ${selectedOwner.status}`}>
                      <span className="owners-table-status-dot"></span>
                      {selectedOwner.status}
                    </span>
                  </div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Total Revenue</div>
                  <div className="owner-modal-val" style={{ color: '#12B76A' }}>
                    {selectedOwner.revenue}
                  </div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Locations Managed</div>
                  <div className="owner-modal-val">{selectedOwner.locations} Properties</div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Total Spaces</div>
                  <div className="owner-modal-val">{selectedOwner.totalSpaces} Parking Spots</div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Contact Email</div>
                  <div className="owner-modal-val" style={{ fontSize: '13px' }}>
                    {selectedOwner.email}
                  </div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Phone Number</div>
                  <div className="owner-modal-val" style={{ fontSize: '13px' }}>
                    {selectedOwner.phone}
                  </div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Headquarters / City</div>
                  <div className="owner-modal-val" style={{ fontSize: '13px' }}>
                    {selectedOwner.city}
                  </div>
                </div>
                <div className="owner-modal-item">
                  <div className="owner-modal-label">Registration Date</div>
                  <div className="owner-modal-val" style={{ fontSize: '13px' }}>
                    {selectedOwner.registered}
                  </div>
                </div>
              </div>
            </div>

            <div className="owner-modal-footer">
              <button
                className="owner-modal-btn-secondary"
                onClick={() => setSelectedOwner(null)}
              >
                Close
              </button>
              <button
                className="owner-modal-btn-primary"
                onClick={() => setSelectedOwner(null)}
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
