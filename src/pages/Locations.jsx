import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Check,
  Square,
  DollarSign,
  SlidersHorizontal,
  Star,
  Eye,
  X,
} from 'lucide-react';
import { parkingsService } from '../services/parkingsService';
import './Locations.css';

const iconMap = {
  MapPin,
  Check,
  Square,
  DollarSign,
};

const statusFilters = ['All', 'Active', 'Inactive'];

export default function Locations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState([
    { id: 'total-locations', icon: 'MapPin', value: '0', label: 'TOTAL LOCATIONS', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
    { id: 'active-locations', icon: 'Check', value: '0', label: 'ACTIVE', iconColor: '#12B76A', iconBg: '#ECFDF3' },
    { id: 'total-spaces', icon: 'Square', value: '0', label: 'TOTAL SPACES', iconColor: '#7F56D9', iconBg: '#F4EBFF' },
    { id: 'est-revenue', icon: 'DollarSign', value: '$0', label: 'EST. REVENUE', iconColor: '#12B76A', iconBg: '#ECFDF3' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [locationsRes, statsRes] = await Promise.allSettled([
          parkingsService.getParkings(),
          parkingsService.getStats()
        ]);

        if (!isMounted) return;

        if (locationsRes.status === 'fulfilled' && locationsRes.value?.data) {
          const rawData = Array.isArray(locationsRes.value.data) ? locationsRes.value.data : (locationsRes.value.data.items || []);
          const mapped = rawData.map(item => ({
            id: item.parkingId || Math.random().toString(),
            name: item.name || 'Unnamed Location',
            owner: item.ownerName || 'Unknown Owner',
            city: item.city || (item.address?.includes(',') ? item.address.split(',')[1].trim() : 'Unknown'),
            address: item.address || 'No Address',
            spaces: item.totalSpaces || 0,
            avail: item.availableSpaces ?? 0,
            priceHr: item.minHourlyRate ? `$${item.minHourlyRate.toFixed(2)}` : '$0',
            revenue: item.totalRevenue ? `$${item.totalRevenue.toLocaleString()}` : '$0',
            rating: item.averageRating ? item.averageRating.toFixed(1) : 'N/A',
            status: item.isOpenNow ? 'active' : 'inactive',
            features: item.features || [],
            type: item.propertyType || 'Parking Facility',
          }));
          setLocations(mapped);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          const s = statsRes.value.data;
          setStats([
            { id: 'total-locations', icon: 'MapPin', value: String(s.totalLocations || 0), label: 'TOTAL LOCATIONS', iconBg: '#EEF4FF', iconColor: '#2B76F6' },
            { id: 'active', icon: 'Check', value: String(s.activeLocations || 0), label: 'ACTIVE', iconBg: '#ECFDF3', iconColor: '#12B76A' },
            { id: 'total-spaces', icon: 'Square', value: String(s.totalSpaces || 0), label: 'TOTAL SPACES', iconBg: '#F4EBFF', iconColor: '#7F56D9' },
            { id: 'network-revenue', icon: 'DollarSign', value: `$${(s.networkRevenue || 0).toLocaleString()}`, label: 'NETWORK REVENUE', iconBg: '#ECFDF3', iconColor: '#12B76A' },
          ]);
        }
      } catch (err) {
        console.error('[Locations] load error:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredLocations = locations.filter((loc) => {
    const matchesFilter =
      activeFilter === 'All' ||
      loc.status.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="locations-page" id="parking-locations-page">
      {/* Page Header */}
      <div className="locations-page-header">
        <div>
          <h1 className="locations-page-title">Parking Locations</h1>
          <p className="locations-page-subtitle">
            All registered locations across the Parkly network
          </p>
        </div>
        <div className="locations-search">
          <Search size={16} strokeWidth={1.8} className="locations-search-icon" />
          <input
            type="text"
            placeholder="Search locations..."
            className="locations-search-input"
            id="locations-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="locations-stats-grid">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.id} className="locations-stat-card">
              <div
                className="locations-stat-icon"
                style={{ background: stat.iconBg }}
              >
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={
                      stat.icon === 'Check' || stat.icon === 'DollarSign' || stat.icon === 'Square'
                        ? 2.5
                        : 2
                    }
                    style={{ color: stat.iconColor }}
                  />
                )}
              </div>
              <div className="locations-stat-value">{stat.value}</div>
              <div className="locations-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar Card */}
      <div className="locations-filter-card">
        <div className="locations-filter-icon-btn">
          <SlidersHorizontal size={15} strokeWidth={2} />
        </div>
        {statusFilters.map((filter) => (
          <button
            key={filter}
            className={`locations-filter-btn ${
              activeFilter === filter ? 'active' : ''
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="locations-table-card">
        <div className="locations-table-wrapper">
          <table className="locations-table" id="locations-table">
            <thead>
              <tr>
                <th>LOCATION</th>
                <th>OWNER</th>
                <th>CITY</th>
                <th>ADDRESS</th>
                <th>SPACES</th>
                <th>AVAIL.</th>
                <th>PRICE/HR</th>
                <th>REVENUE</th>
                <th>RATING</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <tr key={loc.id}>
                    <td className="locations-table-name">{loc.name}</td>
                    <td className="locations-table-owner">{loc.owner}</td>
                    <td className="locations-table-city">{loc.city}</td>
                    <td className="locations-table-address">{loc.address}</td>
                    <td className="locations-table-spaces">{loc.spaces}</td>
                    <td className="locations-table-avail">{loc.avail}</td>
                    <td className="locations-table-price">{loc.priceHr}</td>
                    <td className="locations-table-revenue">{loc.revenue}</td>
                    <td>
                      <span className="locations-table-rating">
                        {loc.rating}
                        <Star size={13} className="locations-rating-star" />
                      </span>
                    </td>
                    <td>
                      <span className={`locations-table-status ${loc.status}`}>
                        <span className="locations-table-status-dot"></span>
                        {loc.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="locations-table-view-btn"
                        id={`view-location-${loc.id}`}
                        onClick={() => setSelectedLocation(loc)}
                      >
                        <Eye size={13} strokeWidth={2} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="locations-table-empty">
                    No locations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div
          className="location-modal-overlay"
          onClick={() => setSelectedLocation(null)}
        >
          <div
            className="location-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="location-modal-header">
              <div className="location-modal-title-box">
                <div className="location-modal-icon-badge">
                  <MapPin size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="location-modal-title">{selectedLocation.name}</h3>
                  <p className="location-modal-sub">{selectedLocation.owner}</p>
                </div>
              </div>
              <button
                className="location-modal-close-btn"
                onClick={() => setSelectedLocation(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="location-modal-body">
              <div className="location-modal-grid">
                <div className="location-modal-item">
                  <div className="location-modal-label">Status</div>
                  <div className="location-modal-val">
                    <span className={`locations-table-status ${selectedLocation.status}`}>
                      <span className="locations-table-status-dot"></span>
                      {selectedLocation.status}
                    </span>
                  </div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Property Type</div>
                  <div className="location-modal-val">{selectedLocation.type}</div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Full Address</div>
                  <div className="location-modal-val" style={{ fontSize: '13px' }}>
                    {selectedLocation.address}, {selectedLocation.city}
                  </div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Hourly Rate</div>
                  <div className="location-modal-val">{selectedLocation.priceHr} / hr</div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Capacity & Available</div>
                  <div className="location-modal-val">
                    {selectedLocation.spaces} total ({selectedLocation.avail} free)
                  </div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Generated Revenue</div>
                  <div className="location-modal-val" style={{ color: '#12B76A' }}>
                    {selectedLocation.revenue}
                  </div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Customer Rating</div>
                  <div className="location-modal-val" style={{ color: '#F79009' }}>
                    {selectedLocation.rating} ★ (Verified reviews)
                  </div>
                </div>

                <div className="location-modal-item">
                  <div className="location-modal-label">Occupancy</div>
                  <div className="location-modal-val">
                    {Math.round(((selectedLocation.spaces - selectedLocation.avail) / selectedLocation.spaces) * 100)}% Occupied
                  </div>
                </div>
              </div>

              {/* Features & Amenities */}
              <div>
                <div className="location-modal-label" style={{ marginBottom: '8px' }}>
                  Features & Amenities
                </div>
                <div className="location-modal-features">
                  {selectedLocation.features.map((feat, idx) => (
                    <span key={idx} className="location-modal-feature-tag">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="location-modal-footer">
              <button
                className="location-modal-btn-secondary"
                onClick={() => setSelectedLocation(null)}
              >
                Close
              </button>
              <button
                className="location-modal-btn-primary"
                onClick={() => setSelectedLocation(null)}
              >
                Manage Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
