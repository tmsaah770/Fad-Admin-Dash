// =============================================
// REPORTS & ANALYTICS — MOCK DATA
// =============================================

export const analyticsStats = [
  {
    id: 'ytd-revenue',
    icon: 'DollarSign',
    value: '$483K',
    label: 'YTD REVENUE',
    badge: '+22%',
    badgeUp: true,
    iconBg: '#EEF4FF',
    iconColor: '#2B76F6',
  },
  {
    id: 'total-bookings',
    icon: 'Calendar',
    value: '9,311',
    label: 'TOTAL BOOKINGS',
    badge: '+16%',
    badgeUp: true,
    iconBg: '#ECFDF3',
    iconColor: '#12B76A',
  },
  {
    id: 'avg-booking',
    icon: 'TrendingUp',
    value: '$51.82',
    label: 'AVG / BOOKING',
    iconBg: '#F4EBFF',
    iconColor: '#7F56D9',
  },
  {
    id: 'active-owners',
    icon: 'Home',
    value: '6',
    label: 'ACTIVE OWNERS',
    iconBg: '#ECFDF3',
    iconColor: '#12B76A',
  },
];

export const revenueAndBookingsTrend = [
  { month: 'Jan', revenue: 42000, bookings: 520 },
  { month: 'Feb', revenue: 39000, bookings: 480 },
  { month: 'Mar', revenue: 50000, bookings: 630 },
  { month: 'Apr', revenue: 57000, bookings: 710 },
  { month: 'May', revenue: 62000, bookings: 790 },
  { month: 'Jun', revenue: 73000, bookings: 980 },
  { month: 'Jul', revenue: 71000, bookings: 1180 },
  { month: 'Aug', revenue: 82000, bookings: 1450 },
];

export const revenueByOwnerData = [
  {
    id: 1,
    name: 'Al-Rashid Parking LLC',
    locations: '4 locations',
    revenue: '$148,400',
    percentage: 37,
    color: '#2B76F6',
  },
  {
    id: 2,
    name: 'Urban Lots Inc.',
    locations: '3 locations',
    revenue: '$98,750',
    percentage: 24,
    color: '#7C3AED',
  },
  {
    id: 3,
    name: 'Vasquez Park Group',
    locations: '2 locations',
    revenue: '$62,100',
    percentage: 16,
    color: '#06AED4',
  },
  {
    id: 4,
    name: 'QuickPark LLC',
    locations: '2 locations',
    revenue: '$44,600',
    percentage: 11,
    color: '#2B76F6',
  },
  {
    id: 5,
    name: 'Premier Parking',
    locations: '1 location',
    revenue: '$31,200',
    percentage: 8,
    color: '#F79009',
  },
  {
    id: 6,
    name: 'Harlem Parking Co.',
    locations: '1 location',
    revenue: '$18,900',
    percentage: 5,
    color: '#60A5FA',
  },
];

export const bookingsByOwnerData = [
  { name: 'Al-Rashid Parking LLC', bookings: 2840 },
  { name: 'Urban Lots Inc.', bookings: 1920 },
  { name: 'Vasquez Park Group', bookings: 1280 },
  { name: 'QuickPark LLC', bookings: 920 },
  { name: 'Premier Parking', bookings: 610 },
];
