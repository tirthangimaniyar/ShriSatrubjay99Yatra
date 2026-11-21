import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  LogOut,
  RefreshCw,
  FileDown,
  Building,
  Bell,
  Image as ImageIcon,
  Settings,
  Shield,
  Key,
  Plus,
  ArrowUpDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { generateDevoteePassPDF } from '../../utils/pdfGenerator';
import { getApiUrl } from '../../config';

export const AdminDashboard = () => {
  const { admin, token, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'overview' | 'registrations' | 'content' | 'settings' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Stats State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Registrations State
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [citiesList, setCitiesList] = useState([]);

  // Modals
  const [selectedReg, setSelectedReg] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Content Management: Announcements & Settings
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    gujaratiTitle: '',
    content: '',
    gujaratiContent: '',
    type: 'announcement',
    displayDate: ''
  });
  const [websiteSettings, setWebsiteSettings] = useState({
    yatraName: '',
    datesGujarati: '',
    location: '',
    contactMobile: '',
    contactEmail: '',
    registrationOpen: true
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Notification Toast message
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/dashboard'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Registrations List
  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        city: cityFilter,
        sortBy,
        limit: 200
      });
      const res = await fetch(getApiUrl(`/api/registrations?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
        if (data.cities) setCitiesList(data.cities);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  // Fetch Announcements & Settings
  const fetchContent = async () => {
    try {
      const [annRes, setRes] = await Promise.all([
        fetch(getApiUrl('/api/announcements?all=true'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl('/api/settings'))
      ]);
      const annData = await annRes.json();
      const setData = await setRes.json();
      if (annData.success) setAnnouncements(annData.announcements);
      if (setData.success && setData.settings) setWebsiteSettings(setData.settings);
    } catch (err) {
      console.error('Failed to load content:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRegistrations();
    fetchContent();
  }, []);

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations();
    }
  }, [search, statusFilter, cityFilter, sortBy]);

  // Handle Status Update (Confirm, Reject, Cancel, Waitlist)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(getApiUrl(`/api/registrations/${id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Registration status updated to ${newStatus}`);
        fetchRegistrations();
        fetchStats();
        if (selectedReg && (selectedReg._id === id || selectedReg.registrationId === id)) {
          setSelectedReg(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Status update failed: ' + err.message, 'error');
    }
  };

  // Handle Delete Registration
  const handleDeleteRegistration = async (id) => {
    try {
      const res = await fetch(getApiUrl(`/api/registrations/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Registration deleted successfully');
        setDeleteConfirmId(null);
        fetchRegistrations();
        fetchStats();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'error');
    }
  };

  // Handle Edit Submit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl(`/api/registrations/${editFormData._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Registration updated successfully');
        setIsEditModalOpen(false);
        fetchRegistrations();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Update failed: ' + err.message, 'error');
    }
  };

  // Handle Excel Export
  const handleExportExcel = async () => {
    try {
      const res = await fetch(getApiUrl('/api/registrations/export/excel'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Palitana-99-Yatra-Registrations-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Excel report downloaded successfully!');
    } catch (err) {
      showToast('Excel export failed: ' + err.message, 'error');
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showToast('Please provide both title and content.', 'error');
      return;
    }
    try {
      const res = await fetch(getApiUrl('/api/announcements'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAnnouncement)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Announcement posted successfully!');
        setNewAnnouncement({ title: '', gujaratiTitle: '', content: '', gujaratiContent: '', type: 'announcement', displayDate: '' });
        fetchContent();
      }
    } catch (err) {
      showToast('Failed to post announcement', 'error');
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      const res = await fetch(getApiUrl(`/api/announcements/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Announcement removed.');
        fetchContent();
      }
    } catch (err) {
      showToast('Failed to delete announcement', 'error');
    }
  };

  // Save Website Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch(getApiUrl('/api/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(websiteSettings)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Website settings saved successfully!');
      }
    } catch (err) {
      showToast('Settings update failed', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      const res = await fetch(getApiUrl('/api/auth/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '' });
      } else {
        setPasswordMsg({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setPasswordMsg({ text: err.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-yatra-cream/60 flex flex-col text-yatra-charcoal">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="bg-yatra-maroon text-white sticky top-0 z-40 border-b-2 border-yatra-gold shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Title & Portal Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-yatra-gold overflow-hidden bg-white/10 flex items-center justify-center">
                <img src="/images/hero-idol.png" alt="Palitana Idol" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base font-gujarati text-amber-100 leading-tight">
                  શ્રી શત્રુંજય ૯૯ યાત્રા - વહીવટી પેનલ
                </h1>
                <span className="text-[10px] text-amber-200/80 font-serifHeading uppercase tracking-widest block">
                  Admin Management Portal
                </span>
              </div>
            </div>

            {/* Admin Profile & Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg text-amber-200 transition-colors"
              >
                <span>View Public Site</span>
              </Link>

              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-amber-100">{admin?.name || 'Administrator'}</span>
                <span className="text-[10px] text-amber-200/60 uppercase">{admin?.role || 'Super Admin'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-900/60 hover:bg-red-800 text-amber-100 transition-colors flex items-center space-x-1 text-xs"
                title="Secure Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Admin Tab Bar */}
      <div className="bg-white border-b border-yatra-gold/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-8 overflow-x-auto py-2 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? 'bg-yatra-maroon text-white shadow-sm'
                  : 'text-gray-600 hover:text-yatra-maroon hover:bg-amber-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Overview (આંકડાકીય વિગત)</span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'registrations'
                  ? 'bg-yatra-maroon text-white shadow-sm'
                  : 'text-gray-600 hover:text-yatra-maroon hover:bg-amber-50'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Registrations (યાત્રિક સંચાલન)</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'content'
                  ? 'bg-yatra-maroon text-white shadow-sm'
                  : 'text-gray-600 hover:text-yatra-maroon hover:bg-amber-50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Announcements (સૂચનાઓ)</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'bg-yatra-maroon text-white shadow-sm'
                  : 'text-gray-600 hover:text-yatra-maroon hover:bg-amber-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings (સેટિંગ્સ)</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'bg-yatra-maroon text-white shadow-sm'
                  : 'text-gray-600 hover:text-yatra-maroon hover:bg-amber-50'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Admin Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header + Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-yatra-maroon font-gujarati">
                  યાત્રા રજીસ્ટ્રેશન ડેશબોર્ડ (Overview)
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time statistics for Shri Shatrunjay Giriraj 99 Yatra
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Excel</span>
                </button>

                <button
                  onClick={() => { fetchStats(); fetchRegistrations(); }}
                  className="p-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Total Registrations */}
              <div className="bg-white p-4 rounded-2xl border-2 border-yatra-gold/40 shadow-sm">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block font-gujarati">કુલ રજીસ્ટ્રેશન</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-yatra-maroon">
                  {loadingStats ? '...' : stats?.totalRegistrations ?? 0}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Total Submissions</span>
              </div>

              {/* Total Participants */}
              <div className="bg-white p-4 rounded-2xl border-2 border-yatra-gold/40 shadow-sm">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block font-gujarati">કુલ યાત્રિકો</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-purple-900">
                  {loadingStats ? '...' : stats?.totalParticipants ?? 0}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Total Devotees</span>
              </div>

              {/* Today's Registrations */}
              <div className="bg-white p-4 rounded-2xl border-2 border-yatra-gold/40 shadow-sm">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block font-gujarati">આજના રજીસ્ટ્રેશન</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-700">
                  {loadingStats ? '...' : stats?.todayRegistrations ?? 0}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Today's Inflow</span>
              </div>

              {/* Pending */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-sm">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block font-gujarati">પેન્ડિંગ (ચકાસણી)</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">
                  {loadingStats ? '...' : stats?.pendingRegistrations ?? 0}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Pending Approval</span>
              </div>

              {/* Confirmed */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block font-gujarati">કન્ફર્મ થયેલ</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {loadingStats ? '...' : stats?.confirmedRegistrations ?? 0}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Confirmed Yatrik</span>
              </div>

              {/* Doli Requests */}
              <div className="bg-white p-4 rounded-2xl border-2 border-purple-300 shadow-sm">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block font-gujarati">ડોળી / પાલખી વિનંતી</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-purple-800">
                  {loadingStats ? '...' : stats?.doliRequests ?? 0}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Doli Assistance</span>
              </div>
            </div>

            {/* City & Category Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Cities */}
              <div className="bg-white rounded-2xl border border-yatra-gold/30 p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-yatra-maroon font-gujarati flex items-center justify-between">
                  <span>મુખ્ય શહેરો મુજબ યાત્રિકો (Top Cities)</span>
                  <MapPin className="w-4 h-4 text-yatra-goldDark" />
                </h3>
                {stats?.topCities && stats.topCities.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {stats.topCities.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                        <span className="font-semibold text-gray-800">{item.city}</span>
                        <span className="bg-yatra-sand px-2 py-0.5 rounded-full font-bold text-yatra-maroon">
                          {item.count} પરિવારો
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No city data available yet.</p>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl border border-yatra-gold/30 p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-yatra-maroon font-gujarati flex items-center justify-between">
                  <span>કેટેગરી મુજબ વિભાજન (Category Breakdown)</span>
                  <Users className="w-4 h-4 text-yatra-goldDark" />
                </h3>
                {stats?.categoryCounts && Object.keys(stats.categoryCounts).length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {Object.entries(stats.categoryCounts).map(([cat, count], idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                        <span className="font-semibold text-gray-800 truncate pr-2">{cat}</span>
                        <span className="bg-amber-100 px-2 py-0.5 rounded-full font-bold text-amber-900 shrink-0">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No category data available.</p>
                )}
              </div>
            </div>

            {/* Quick Action to Jump to Registrations */}
            <div className="p-4 bg-gradient-to-r from-yatra-maroon to-yatra-purple text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-sm font-gujarati">યાત્રિકોની યાદી અને રજીસ્ટ્રેશન વિગતો સંચાલિત કરો</h4>
                <p className="text-xs text-amber-200/80">Manage, approve, reject, edit and download devotee passes in one place.</p>
              </div>
              <button
                onClick={() => setActiveTab('registrations')}
                className="px-5 py-2.5 bg-white text-yatra-maroon font-bold text-xs rounded-xl shadow hover:bg-amber-50 transition-all font-gujarati"
              >
                રજીસ્ટ્રેશન યાદી જુઓ (View All)
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: REGISTRATIONS MANAGEMENT ================= */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Bar with Search & Filters */}
            <div className="bg-white p-5 rounded-2xl border border-yatra-gold/40 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-yatra-maroon font-gujarati">
                  રજીસ્ટ્રેશન યાદી (Registrations Directory)
                </h2>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportExcel}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Excel (.xlsx)</span>
                  </button>

                  <button
                    onClick={fetchRegistrations}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                    title="Reload"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search and Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ID, Name, Mobile, City..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none bg-white font-medium"
                  >
                    <option value="All">All Statuses (તમામ સ્થિતિ)</option>
                    <option value="Pending">Pending (પેન્ડિંગ)</option>
                    <option value="Confirmed">Confirmed (કન્ફર્મ)</option>
                    <option value="Waitlist">Waitlist (પ્રતીક્ષા યાદી)</option>
                    <option value="Cancelled">Cancelled (રદ થયેલ)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none bg-white"
                  >
                    <option value="All">All Cities (તમામ શહેરો)</option>
                    {citiesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none bg-white"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="name">Sort: Name (A-Z)</option>
                    <option value="participants">Sort: Most Participants</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-yatra-gold/30 shadow-sm overflow-hidden">
              {loadingRegistrations ? (
                <div className="text-center py-16 text-xs text-gray-500 font-gujarati">
                  રજીસ્ટ્રેશન યાદી લોડ થઈ રહી છે...
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-xs font-gujarati">
                  કોઈ રજીસ્ટ્રેશન મળ્યું નથી. (No records found matching filters).
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-yatra-cream text-yatra-maroon font-bold border-b border-yatra-gold/30 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-3">Reg. ID</th>
                        <th className="py-3 px-3">Devotee Name</th>
                        <th className="py-3 px-3">Mobile & City</th>
                        <th className="py-3 px-3 text-center">Participants</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Doli</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {registrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-amber-50/40 transition-colors">
                          {/* Registration ID */}
                          <td className="py-3 px-3 font-mono font-bold text-yatra-maroon">
                            {reg.registrationId}
                          </td>

                          {/* Name */}
                          <td className="py-3 px-3">
                            <span className="font-bold text-gray-900 block font-gujarati">{reg.fullName}</span>
                            <span className="text-[10px] text-gray-500">{reg.gender}, {reg.age} Yrs</span>
                          </td>

                          {/* Mobile & City */}
                          <td className="py-3 px-3">
                            <span className="font-semibold text-gray-800 block">{reg.mobileNumber}</span>
                            <span className="text-[11px] text-gray-500 font-gujarati">{reg.city}</span>
                          </td>

                          {/* Total Participants */}
                          <td className="py-3 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-yatra-sand font-bold text-yatra-maroon">
                              {reg.totalParticipants} Devotees
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3 font-gujarati text-[11px] text-gray-700 truncate max-w-[120px]">
                            {reg.registrationCategory}
                          </td>

                          {/* Doli Need */}
                          <td className="py-3 px-3">
                            {reg.doliAssistanceRequired ? (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                Doli Req.
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">-</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <select
                              value={reg.status}
                              onChange={(e) => handleUpdateStatus(reg._id, e.target.value)}
                              className={`text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none transition-colors ${
                                reg.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : reg.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-red-50 text-red-800 border-red-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Waitlist">Waitlist</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => { setSelectedReg(reg); setIsViewModalOpen(true); }}
                                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                title="View Complete Details"
                              >
                                <Eye className="w-3.5 h-3.5 text-yatra-maroon" />
                              </button>

                              {/* Download PDF Pass */}
                              <button
                                onClick={() => generateDevoteePassPDF(reg)}
                                className="p-1.5 rounded-lg bg-yatra-sand/80 hover:bg-yatra-sand text-yatra-maroon transition-colors"
                                title="Download PDF Pass"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => { setEditFormData(reg); setIsEditModalOpen(true); }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                                title="Edit Record"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteConfirmId(reg._id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 3: CONTENT MANAGEMENT (ANNOUNCEMENTS) ================= */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-yatra-maroon font-gujarati">
                  વેબસાઇટ સૂચના સંચાલન (Announcements Management)
                </h2>
                <p className="text-xs text-gray-500">
                  Add and manage announcements visible on public website ribbon
                </p>
              </div>
            </div>

            {/* Create Announcement Form */}
            <form onSubmit={handleCreateAnnouncement} className="bg-white p-6 rounded-2xl border border-yatra-gold/40 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-yatra-maroon font-gujarati flex items-center space-x-2">
                <Plus className="w-4 h-4 text-yatra-goldDark" />
                <span>નવી સૂચના ઉમેરો (Post New Announcement)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title (Gujarati)</label>
                  <input
                    type="text"
                    value={newAnnouncement.gujaratiTitle}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, gujaratiTitle: e.target.value, title: e.target.value }))}
                    placeholder="દા.ત. ૯૯ યાત્રા પ્રથમ સંઘ પ્રયાણ તારીખ"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none font-gujarati"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Tag / Date</label>
                  <input
                    type="text"
                    value={newAnnouncement.displayDate}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, displayDate: e.target.value }))}
                    placeholder="દા.ત. નવેમ્બર ૨૦૨૬"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none font-gujarati"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Announcement Message (Gujarati Content)</label>
                  <textarea
                    rows="2"
                    value={newAnnouncement.gujaratiContent}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, gujaratiContent: e.target.value, content: e.target.value }))}
                    placeholder="સંપૂર્ણ સૂચના લખાણ..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none font-gujarati"
                    required
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-yatra-maroon hover:bg-yatra-maroonLight text-white font-bold text-xs rounded-xl transition-all shadow-sm font-gujarati"
              >
                સૂચના પ્રસિદ્ધ કરો (Post Announcement)
              </button>
            </form>

            {/* Existing Announcements List */}
            <div className="bg-white rounded-2xl border border-yatra-gold/30 shadow-sm overflow-hidden p-5 space-y-4">
              <h3 className="font-bold text-sm text-yatra-maroon font-gujarati">
                હાલની સક્રિય સૂચનાઓ ({announcements.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {announcements.map((item) => (
                  <div key={item._id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1 font-gujarati">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-yatra-maroon">{item.gujaratiTitle || item.title}</span>
                        {item.displayDate && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-sans">
                            {item.displayDate}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{item.gujaratiContent || item.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(item._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: WEBSITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 rounded-2xl border border-yatra-gold/40 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-yatra-maroon font-gujarati">
                વેબસાઇટ સેટિંગ્સ અને નિયંત્રણ (Website Settings)
              </h2>
              <p className="text-xs text-gray-500">
                Update public website parameters and registration availability
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 font-gujarati text-left">
              {/* Registration Open Toggle */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-yatra-gold/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-yatra-maroon block">
                    ઓનલાઇન રજીસ્ટ્રેશન ચાલુ રાખવું (Registration Open)
                  </span>
                  <span className="text-xs text-gray-600">
                    If toggled off, devotees will see a registration closed notice on the website.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={websiteSettings.registrationOpen}
                  onChange={(e) => setWebsiteSettings(prev => ({ ...prev, registrationOpen: e.target.checked }))}
                  className="w-5 h-5 text-yatra-maroon rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">યાત્રા પર્વ શીર્ષક (Yatra Name)</label>
                <input
                  type="text"
                  value={websiteSettings.yatraName}
                  onChange={(e) => setWebsiteSettings(prev => ({ ...prev, yatraName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">યાત્રા તારીખો (Dates in Gujarati)</label>
                <input
                  type="text"
                  value={websiteSettings.datesGujarati || ''}
                  onChange={(e) => setWebsiteSettings(prev => ({ ...prev, datesGujarati: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">સંઘ હેલ્પલાઇન મોબાઈલ (Contact Mobile)</label>
                  <input
                    type="text"
                    value={websiteSettings.contactMobile || ''}
                    onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactMobile: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ઈમેલ એડ્રેસ (Contact Email)</label>
                  <input
                    type="email"
                    value={websiteSettings.contactEmail || ''}
                    onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3 bg-yatra-maroon hover:bg-yatra-maroonLight text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {savingSettings ? 'સાચવી રહ્યા છીએ...' : 'સેટિંગ્સ સેવ કરો (Save Settings)'}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 5: ADMIN PROFILE ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-md bg-white p-6 rounded-2xl border border-yatra-gold/40 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-yatra-maroon font-serifHeading">
                Admin Profile & Password
              </h2>
              <p className="text-xs text-gray-500">
                Update administrative access credentials
              </p>
            </div>

            <div className="p-4 bg-yatra-cream rounded-xl text-xs space-y-1">
              <p><span className="font-bold">Name:</span> {admin?.name}</p>
              <p><span className="font-bold">Email:</span> {admin?.email}</p>
              <p><span className="font-bold">Role:</span> {admin?.role}</p>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 text-left">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                Change Password
              </h3>

              {passwordMsg && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  passwordMsg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {passwordMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-yatra-gold focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-yatra-maroon hover:bg-yatra-maroonLight text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ================= MODAL: VIEW REGISTRATION DETAILS ================= */}
      {isViewModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-yatra-gold max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5 font-gujarati text-left">
              <div className="flex items-center justify-between border-b border-yatra-gold/30 pb-3">
                <div>
                  <span className="text-xs text-gray-500 font-bold">રજીસ્ટ્રેશન આઇડી</span>
                  <h3 className="text-xl font-bold font-mono text-yatra-maroon">{selectedReg.registrationId}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedReg.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedReg.status}
                </span>
              </div>

              {/* Lead Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-yatra-cream/60 p-4 rounded-xl">
                <div>
                  <span className="text-gray-500 block font-bold">મુખ્ય યાત્રિક:</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedReg.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">જાતિ / ઉંમર:</span>
                  <span className="font-semibold text-gray-900">{selectedReg.gender}, {selectedReg.age} વર્ષ</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">મોબાઈલ નંબર:</span>
                  <span className="font-semibold text-gray-900 font-mono">{selectedReg.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">વોટ્સએપ નંબર:</span>
                  <span className="font-semibold text-gray-900 font-mono">{selectedReg.whatsappNumber || selectedReg.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">ઈમેલ:</span>
                  <span className="font-semibold text-gray-900">{selectedReg.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">શહેર / રાજ્ય:</span>
                  <span className="font-semibold text-gray-900">{selectedReg.city}, {selectedReg.state} ({selectedReg.pincode})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block font-bold">સંપૂર્ણ સરનામું:</span>
                  <span className="text-gray-800">{selectedReg.fullAddress}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">સબમિશન સમય:</span>
                  <span className="font-semibold text-gray-900">{selectedReg.createdAt ? new Date(selectedReg.createdAt).toLocaleString('en-IN') : '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">સમયાવધિ (Expires At):</span>
                  <span className="font-semibold text-amber-700">{selectedReg.expiresAt ? new Date(selectedReg.expiresAt).toLocaleString('en-IN') : '૨ કલાક (2 Hours)'}</span>
                </div>
              </div>

              {/* Family Members */}
              {selectedReg.familyMembers && selectedReg.familyMembers.length > 0 && (
                <div className="border border-yatra-gold/30 rounded-xl overflow-hidden">
                  <div className="bg-yatra-maroon text-amber-100 text-xs font-bold px-4 py-2">
                    સાથે આવનાર પરિવાર સભ્યો ({selectedReg.familyMembers.length})
                  </div>
                  <div className="divide-y divide-gray-100 bg-white">
                    {selectedReg.familyMembers.map((m, idx) => (
                      <div key={idx} className="p-3 text-xs flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                          {idx + 1}. {m.name} ({m.relation})
                        </span>
                        <span className="text-gray-500">{m.gender}, {m.age} વર્ષ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special needs */}
              <div className="space-y-2 text-xs">
                <p>
                  <span className="font-bold text-gray-800">ડોળી / પાલખી વિનંતી:</span>{' '}
                  <span className={selectedReg.doliAssistanceRequired ? 'text-purple-700 font-bold' : 'text-gray-600'}>
                    {selectedReg.doliAssistanceRequired ? 'હા (Yes - Doli Assistance Required)' : 'ના (No)'}
                  </span>
                </p>
                {selectedReg.hasMedicalNeed && (
                  <p>
                    <span className="font-bold text-gray-800">તબીબી જરૂરિયાત:</span>{' '}
                    <span className="text-red-700">{selectedReg.medicalDetails}</span>
                  </p>
                )}
                <p>
                  <span className="font-bold text-gray-800">ઇમરજન્સી સંપર્ક:</span>{' '}
                  <span className="font-mono">{selectedReg.emergencyContactName} ({selectedReg.emergencyContactNumber})</span>
                </p>
                {selectedReg.additionalNotes && (
                  <p>
                    <span className="font-bold text-gray-800">અન્ય નોંધ:</span>{' '}
                    <span>{selectedReg.additionalNotes}</span>
                  </p>
                )}
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-4 border-t border-yatra-gold/30 flex items-center justify-between">
                <button
                  onClick={() => generateDevoteePassPDF(selectedReg)}
                  className="px-4 py-2 bg-yatra-maroon text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
                >
                  <FileDown className="w-4 h-4 text-amber-200" />
                  <span>Download Pass (PDF)</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { handleUpdateStatus(selectedReg._id, 'Confirmed'); }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                  >
                    Approve / Confirm
                  </button>
                  <button
                    onClick={() => { handleUpdateStatus(selectedReg._id, 'Cancelled'); }}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                  >
                    Reject / Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT REGISTRATION ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-yatra-gold max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-yatra-maroon font-gujarati mb-4">
              યાત્રિક વિગતો સુધારો (Edit Registration)
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-gujarati">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Mobile</label>
                  <input
                    type="text"
                    value={editFormData.mobileNumber || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={editFormData.age || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">City</label>
                <input
                  type="text"
                  value={editFormData.city || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Full Address</label>
                <textarea
                  rows="2"
                  value={editFormData.fullAddress || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={editFormData.registrationCategory || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, registrationCategory: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)">99 Yatra Devotee (૯૯ યાત્રા યાત્રિક)</option>
                  <option value="Chha'ri Palit Sangh (છ'રી પાલિત સંઘ યાત્રિક)">Chha'ri Palit Sangh (છ'રી પાલિત સંઘ યાત્રિક)</option>
                  <option value="Seva Bhavi Karyakarta (સેવાભાવી કાર્યકર્તા)">Seva Bhavi Karyakarta (સેવાભાવી કાર્યકર્તા)</option>
                  <option value="Senior Citizen Devotee (વરિષ્ઠ નાગરિક)">Senior Citizen Devotee (વરિષ્ઠ નાગરિક)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-yatra-maroon text-white font-bold rounded-xl text-xs"
              >
                Save Changes (સાચવો)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-red-600 mx-auto" />
            <h4 className="font-bold text-base text-gray-900">Confirm Deletion</h4>
            <p className="text-xs text-gray-600 font-gujarati">
              Are you sure you want to permanently delete this registration? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRegistration(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
