// =============================================
// PARKLY DASHBOARD — MOCK DATA
// =============================================

export const statsCardsRow1 = [
  {
    id: 'total-users',
    icon: 'Users',
    value: '15',
    label: 'TOTAL USERS',
    subtext: '+3 this week',
    trend: '+12%',
    trendUp: true,
    iconBg: '#E0F2FE',
    iconColor: '#2B76F6',
  },
  {
    id: 'parking-owners',
    icon: 'CarFront',
    value: '8',
    label: 'PARKING OWNERS',
    subtext: '2 pending review',
    trend: '+2',
    trendUp: true,
    iconBg: '#F0FDF4',
    iconColor: '#12B76A',
  },
  {
    id: 'locations',
    icon: 'MapPin',
    value: '4',
    label: 'LOCATIONS',
    subtext: 'All operational',
    trend: 'Stable',
    trendUp: null,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: 'total-reservations',
    icon: 'CalendarCheck',
    value: '10',
    label: 'TOTAL RESERVATIONS',
    subtext: '1 active now',
    trend: '+8%',
    trendUp: true,
    iconBg: '#E0F2FE',
    iconColor: '#2B76F6',
  },
];

export const statsCardsRow2 = [
  {
    id: 'active-now',
    icon: 'CheckCircle',
    value: '1',
    label: 'ACTIVE NOW',
    subtext: '',
    trend: '',
    trendUp: null,
    iconBg: '#ECFDF3',
    iconColor: '#12B76A',
  },
  {
    id: 'avg-revenue',
    icon: 'DollarSign',
    value: '$82,200',
    label: 'AUG REVENUE',
    subtext: '',
    trend: '+9.8%',
    trendUp: true,
    iconBg: '#EBF3FE',
    iconColor: '#2B76F6',
  },
  {
    id: 'total-revenue',
    icon: 'BarChart3',
    value: '$483K',
    label: 'TOTAL REVENUE',
    subtext: '',
    trend: '',
    trendUp: null,
    iconBg: '#FFF4E5',
    iconColor: '#F79009',
  },
  {
    id: 'unread-alerts',
    icon: 'Bell',
    value: '4',
    label: 'UNREAD ALERTS',
    subtext: '',
    trend: '',
    trendUp: null,
    iconBg: '#FEF3F2',
    iconColor: '#F04438',
  },
];

export const revenueChartData = [
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 30000 },
  { month: 'Mar', revenue: 28000 },
  { month: 'Apr', revenue: 35000 },
  { month: 'May', revenue: 42000 },
  { month: 'Jun', revenue: 55000 },
  { month: 'Jul', revenue: 68000 },
  { month: 'Aug', revenue: 82200 },
];

export const bookingsChartData = [
  { day: 'Tue', bookings: 45 },
  { day: 'Wed', bookings: 0 },
  { day: 'Thu', bookings: 75 },
  { day: 'Fri', bookings: 90 },
  { day: 'Sat', bookings: 110 },
  { day: 'Sun', bookings: 85 },
];

export const recentActivity = [
  {
    id: 1,
    icon: 'UserPlus',
    iconColor: '#2B76F6',
    iconBg: '#EBF3FE',
    text: 'Soo-Jin Park created a new account',
    time: '5 min ago',
  },
  {
    id: 2,
    icon: 'FileText',
    iconColor: '#F79009',
    iconBg: '#FFF4E5',
    text: 'Irene Kowalski submitted owner application',
    time: '18 min ago',
  },
  {
    id: 3,
    icon: 'Calendar',
    iconColor: '#2B76F6',
    iconBg: '#EBF3FE',
    text: 'New booking at Marina Bay Lot — #RES-9842',
    time: '34 min ago',
  },
  {
    id: 4,
    icon: 'Zap',
    iconColor: '#12B76A',
    iconBg: '#ECFDF3',
    text: 'CityPark Central reached 95% occupancy',
    time: '1h ago',
  },
  {
    id: 5,
    icon: 'TrendingUp',
    iconColor: '#7C3AED',
    iconBg: '#F3F0FF',
    text: 'Platform revenue crossed $500K milestone',
    time: '2h ago',
  },
  {
    id: 6,
    icon: 'Plus',
    iconColor: '#06AED4',
    iconBg: '#ECFEFF',
    text: 'Marcus Chen added Midtown Express Deck',
    time: '5h ago',
  },
];

export const pendingApprovals = [
  {
    id: 1,
    name: 'Sophie Laurent',
    org: 'Park Elite NY',
    initials: 'SL',
    color: '#6366F1',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Irene Kowalski',
    org: 'Safe Parking Network',
    initials: 'IK',
    color: '#2B76F6',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Omar Hassan',
    org: 'New user · email unverified',
    initials: 'OH',
    color: '#12B76A',
    status: 'Verify',
  },
  {
    id: 4,
    name: 'Nina Petrov',
    org: 'New user · email unverified',
    initials: 'NP',
    color: '#7C3AED',
    status: 'Verify',
  },
];

export const navItems = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { label: 'Users', icon: 'Users', path: '/users' },
  { label: 'Parking Owners', icon: 'CarFront', path: '/parking-owners' },
  { label: 'Locations', icon: 'MapPin', path: '/locations' },
  { label: 'Reservations', icon: 'CalendarDays', path: '/reservations' },
  { label: 'Analytics & Reports', icon: 'BarChart3', path: '/analytics' },
  { label: 'Notifications', icon: 'Bell', path: '/notifications' },
  { label: 'Settings', icon: 'Settings', path: '/settings' },
];
