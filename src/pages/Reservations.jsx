import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Check,
  Bell,
  X,
  Eye,
} from 'lucide-react';
import {
  reservationsStats,
  reservationsFilters,
  reservationsTableData,
} from '../data/reservationsData';
import { reservationsService } from '../services/reservationsService';
import './Reservations.css';

const iconMap = {
  Calendar,
  Check,
  Bell,
  X,
};

const initialResStats = [
  { id: 'total', label: 'TOTAL RESERVATIONS', value: '0', icon: 'Calendar', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
  { id: 'active', label: 'ACTIVE NOW', value: '0', icon: 'Check', iconColor: '#12B76A', iconBg: '#ECFDF3' },
  { id: 'upcoming', label: 'UPCOMING', value: '0', icon: 'Clock', iconColor: '#7F56D9', iconBg: '#F4EBFF' },
  { id: 'revenue', label: 'REVENUE PROCESSED', value: '$0', icon: 'DollarSign', iconColor: '#12B76A', iconBg: '#ECFDF3' },
];

export default function Reservations() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(initialResStats);

  // Fetch live reservations from Parkly API
  useEffect(() => {
    let isMounted = true;
    async function fetchReservations() {
      try {
        const res = await reservationsService.getReservations();
        if (!isMounted) return;

        if (Array.isArray(res?.data)) {
          const mapped = res.data.map((r, idx) => ({
            id: r.reservationId || idx + 500,
            code: r.qrCode ? `PK-${r.qrCode}` : `PK-${4200 + idx}`,
            customer: r.userName || 'Driver Customer',
            initials: (r.userName || 'DC').slice(0, 2).toUpperCase(),
            color: '#2B76F6',
            location: r.parkingName || 'Parkly Hub',
            space: r.spotNumber ? `S${r.spotNumber}` : 'S1',
            date: r.arrivalTime ? new Date(r.arrivalTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
            time: `${new Date(r.arrivalTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(r.departureTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            duration: '2h',
            amount: r.totalPrice ? `$${r.totalPrice.toFixed(2)}` : '$10.00',
            status: (r.status?.toLowerCase() || 'upcoming'),
            vehicle: 'Vehicle',
            plate: 'Plate',
            paymentMethod: 'Credit Card',
          }));
          setReservations(mapped);

          const activeCount = mapped.filter((r) => r.status === 'active').length;
          const upcomingCount = mapped.filter((r) => r.status === 'upcoming').length;
          const totalRev = mapped.reduce((acc, r) => acc + (parseFloat(r.amount.replace('$', '')) || 0), 0);

          setStats([
            { id: 'total', label: 'TOTAL RESERVATIONS', value: String(mapped.length), icon: 'Calendar', iconColor: '#2B76F6', iconBg: '#EEF4FF' },
            { id: 'active', label: 'ACTIVE NOW', value: String(activeCount), icon: 'Check', iconColor: '#12B76A', iconBg: '#ECFDF3' },
            { id: 'upcoming', label: 'UPCOMING', value: String(upcomingCount), icon: 'Clock', iconColor: '#7F56D9', iconBg: '#F4EBFF' },
            { id: 'revenue', label: 'REVENUE PROCESSED', value: `$${totalRev.toLocaleString()}`, icon: 'DollarSign', iconColor: '#12B76A', iconBg: '#ECFDF3' },
          ]);
        }
      } catch (err) {
        console.warn('[Reservations] API load error:', err.message);
      }
    }
    fetchReservations();
    return () => { isMounted = false; };
  }, []);

  const filteredReservations = reservations.filter((res) => {
    const matchesFilter =
      activeFilter === 'all' ||
      res.status.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      res.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.space.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="reservations-page" id="reservations-page">
      {/* Page Header */}
      <div className="reservations-page-header">
        <div>
          <h1 className="reservations-page-title">Reservations</h1>
          <p className="reservations-page-subtitle">
            All platform bookings across every location
          </p>
        </div>
        <div className="reservations-search">
          <Search size={16} strokeWidth={1.8} className="reservations-search-icon" />
          <input
            type="text"
            placeholder="Search reservations..."
            className="reservations-search-input"
            id="reservations-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="reservations-stats-grid">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.id} className="reservations-stat-card">
              <div
                className="reservations-stat-icon"
                style={{ background: stat.iconBg }}
              >
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={stat.icon === 'Check' || stat.icon === 'X' ? 2.5 : 2}
                    style={{ color: stat.iconColor }}
                  />
                )}
              </div>
              <div className="reservations-stat-value">{stat.value}</div>
              <div className="reservations-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs Card */}
      <div className="reservations-filter-card">
        {reservationsFilters.map((tab) => (
          <button
            key={tab.id}
            className={`reservations-filter-btn ${
              activeFilter === tab.id ? 'active' : ''
            }`}
            onClick={() => setActiveFilter(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="reservations-filter-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="reservations-table-card">
        <div className="reservations-table-wrapper">
          <table className="reservations-table" id="reservations-table">
            <thead>
              <tr>
                <th>CODE</th>
                <th>CUSTOMER</th>
                <th>LOCATION</th>
                <th>SPACE</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>DURATION</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <tr key={res.id}>
                    <td className="reservations-table-code">{res.code}</td>
                    <td>
                      <div className="reservations-table-customer">
                        <div
                          className="reservations-table-avatar"
                          style={{ background: res.color }}
                        >
                          {res.initials}
                        </div>
                        <span className="reservations-table-name">{res.customer}</span>
                      </div>
                    </td>
                    <td className="reservations-table-loc">{res.location}</td>
                    <td className="reservations-table-space">{res.space}</td>
                    <td className="reservations-table-date">{res.date}</td>
                    <td className="reservations-table-time">{res.time}</td>
                    <td className="reservations-table-duration">{res.duration}</td>
                    <td className="reservations-table-amount">{res.amount}</td>
                    <td>
                      <span className={`reservations-table-status ${res.status}`}>
                        <span className="reservations-table-status-dot"></span>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="reservations-table-view-btn"
                        id={`view-reservation-${res.id}`}
                        onClick={() => setSelectedReservation(res)}
                      >
                        <Eye size={13} strokeWidth={2} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="reservations-table-empty">
                    No reservations found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div
          className="reservation-modal-overlay"
          onClick={() => setSelectedReservation(null)}
        >
          <div
            className="reservation-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reservation-modal-header">
              <div className="reservation-modal-title-box">
                <div
                  className="reservation-modal-avatar"
                  style={{ background: selectedReservation.color }}
                >
                  {selectedReservation.initials}
                </div>
                <div>
                  <h3 className="reservation-modal-title">
                    {selectedReservation.customer}
                  </h3>
                  <p className="reservation-modal-sub">
                    Booking Code: <strong>{selectedReservation.code}</strong>
                  </p>
                </div>
              </div>
              <button
                className="reservation-modal-close-btn"
                onClick={() => setSelectedReservation(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="reservation-modal-body">
              <div className="reservation-modal-grid">
                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Status</div>
                  <div className="reservation-modal-val">
                    <span
                      className={`reservations-table-status ${selectedReservation.status}`}
                    >
                      <span className="reservations-table-status-dot"></span>
                      {selectedReservation.status}
                    </span>
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Parking Location</div>
                  <div className="reservation-modal-val">
                    {selectedReservation.location}
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Assigned Space</div>
                  <div className="reservation-modal-val">
                    Space {selectedReservation.space}
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Duration</div>
                  <div className="reservation-modal-val">
                    {selectedReservation.duration} ({selectedReservation.time})
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Date</div>
                  <div className="reservation-modal-val">
                    {selectedReservation.date}
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Total Amount</div>
                  <div
                    className="reservation-modal-val"
                    style={{ color: '#12B76A' }}
                  >
                    {selectedReservation.amount} ({selectedReservation.paymentMethod})
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">Vehicle Model</div>
                  <div className="reservation-modal-val">
                    {selectedReservation.vehicle}
                  </div>
                </div>

                <div className="reservation-modal-item">
                  <div className="reservation-modal-label">License Plate</div>
                  <div className="reservation-modal-val">
                    {selectedReservation.plate}
                  </div>
                </div>
              </div>
            </div>

            <div className="reservation-modal-footer">
              <button
                className="reservation-modal-btn-secondary"
                onClick={() => setSelectedReservation(null)}
              >
                Close
              </button>
              <button
                className="reservation-modal-btn-primary"
                onClick={() => setSelectedReservation(null)}
              >
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
