import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { parkingsService } from '../services/parkingsService';
import './PendingApprovals.css';

export default function PendingApprovals() {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadApprovals() {
      try {
        const res = await parkingsService.getParkings();
        if (isMounted && Array.isArray(res?.data)) {
          // Check if any parking is inactive or unapproved
          const pending = res.data.filter((p) => p.isOpenNow === false).map((p, idx) => ({
            id: p.parkingId || idx,
            name: p.name || 'New Facility',
            org: p.address || 'Facility Location',
            status: 'Pending',
            initials: (p.name || 'PK').slice(0, 2).toUpperCase(),
            color: '#7F56D9',
          }));
          setApprovals(pending);
        }
      } catch (err) {
        console.warn('[PendingApprovals] Error:', err.message);
      }
    }
    loadApprovals();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pending-approvals-card" id="pending-approvals">
      <h3 className="pending-approvals-title">Pending Approvals</h3>
      <div className="pending-approvals-list">
        {approvals.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6F767E' }}>
            <CheckCircle2 size={32} color="#12B76A" style={{ margin: '0 auto 8px auto', display: 'block' }} />
            <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>No pending approvals</p>
            <span style={{ fontSize: '12px', color: '#9A9FA5' }}>All locations and owners are approved</span>
          </div>
        ) : (
          approvals.map((item) => (
            <div key={item.id} className="pending-approvals-item">
              <div
                className="pending-approvals-avatar"
                style={{ background: item.color }}
              >
                {item.initials}
              </div>
              <div className="pending-approvals-info">
                <span className="pending-approvals-name">{item.name}</span>
                <span className="pending-approvals-org">{item.org}</span>
              </div>
              <button
                className={`pending-approvals-badge ${item.status.toLowerCase()}`}
                id={`approval-${item.id}`}
              >
                {item.status}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
