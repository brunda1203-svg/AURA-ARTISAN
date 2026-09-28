import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Clock,
  Award,
  User as UserIcon,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Truck,
  MapPin,
  Calendar,
  Gift,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  KeyRound,
  Shield,
  Smartphone,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const DashboardView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    setIsAuthModalOpen,
    setAuthModalMode,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    advanceTrackingSimulation,
    loyaltyRewards,
    applyCoupon,
    redeemReward,
    updateProfile,
    toggleMfa,
    updatePassword,
    securityLogs,
    dashboardTab,
    setDashboardTab,
    pushPermission,
    requestPushPermission,
    pushSettings,
    updatePushSettings,
    sendPushNotification,
    setActiveView,
    addToCart,
    knowledgeBase,
    setIsTrainingModalOpen,
    setIsChatOpen,
    n8nConfig,
    testN8nConnection,
  } = useApp();

  // Profile Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.shippingAddress.street || '');
  const [apartment, setApartment] = useState(user?.shippingAddress.apartment || '');
  const [city, setCity] = useState(user?.shippingAddress.city || '');
  const [stateVal, setStateVal] = useState(user?.shippingAddress.state || '');
  const [postalCode, setPostalCode] = useState(user?.shippingAddress.postalCode || '');
  const [giftNote, setGiftNote] = useState(user?.giftPreferences.defaultGiftNote || '');
  const [preferredRibbon, setPreferredRibbon] = useState<
    'Emerald Velvet' | 'Champagne Gold' | 'Vintage Rose' | 'Lavender Satin' | 'Blush Pink Satin' | 'Golden Honey Satin'
  >(
    user?.giftPreferences.preferredRibbon || 'Emerald Velvet'
  );
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Copied code feedback state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Selected Order for detail modal
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-700">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Patron Sign In Required</h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
          Please authenticate with your username and password to securely view your personal gift orders, real-time shipment updates, and loyalty rewards.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
        >
          Sign In to Your Dashboard
        </button>
      </div>
    );
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      phone,
      shippingAddress: {
        ...user.shippingAddress,
        street,
        apartment,
        city,
        state: stateVal,
        postalCode,
      },
      giftPreferences: {
        ...user.giftPreferences,
        defaultGiftNote: giftNote,
        preferredRibbon,
      },
    });
    setProfileSuccessMsg('Contact information and delivery preferences saved securely.');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', success: false });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters long.', success: false });
      return;
    }
    updatePassword(oldPassword, newPassword);
    setPasswordMsg({ text: 'Password successfully updated. Secure session refreshed.', success: true });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Helper for tracking stage indices
  const stages: OrderStatus[] = [
    'Order Placed',
    'Artisan Crafting & Gift Wrapping',
    'Dispatched from Atelier',
    'In Transit',
    'Out for Delivery',
    'Delivered',
  ];

  const currentOrder = activeTrackingOrder || orders[0];
  const currentStageIndex = currentOrder ? stages.indexOf(currentOrder.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-[#2D2A26] to-[#1C1917] rounded-3xl p-6 sm:p-8 text-[#FAF8F5] mb-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative floral pattern overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-200/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold font-sans">
                  {user.loyaltyTier}
                </span>
                <span className="text-stone-500">·</span>
                <span className="text-xs text-stone-300">Member since {user.memberSince}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {user.fullName}’s Personalized Atelier
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                Track your active shipments in real-time, manage your multi-factor security, and redeem your exclusive loyalty rewards.
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 min-w-[130px]">
              <span className="text-[11px] text-stone-300 block">Aura Loyalty Points</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-serif text-2xl font-bold text-amber-200">{user.loyaltyPoints}</span>
                <span className="text-[11px] text-amber-300/80">pts</span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">Value: ${(user.loyaltyPoints / 20).toFixed(2)}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 min-w-[130px]">
              <span className="text-[11px] text-stone-300 block">Account Security</span>
              <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-sm mt-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{user.mfaEnabled ? '2FA Active' : 'Basic Password'}</span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">{user.mfaMethod.toUpperCase()} Protected</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 mt-8 overflow-x-auto pb-2 border-t border-white/10 pt-4 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: UserIcon },
            { id: 'shipments', label: 'Live Shipments', icon: Truck, badge: orders.filter((o) => o.status !== 'Delivered').length },
            { id: 'orders', label: 'Order History', icon: Package },
            { id: 'rewards', label: 'Loyalty & Discounts', icon: Award },
            { id: 'profile', label: 'Profile Settings', icon: UserIcon },
            { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
            { id: 'notifications', label: 'Push Alert Settings', icon: Bell },
            { id: 'ai-training', label: 'AI Chat Training', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = dashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDashboardTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-100 text-stone-900 shadow-md font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-900' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {dashboardTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Active Live Shipment Quick Card */}
          {currentOrder && currentOrder.status !== 'Delivered' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900">Current Active Shipment</span>
                      <span className="text-xs text-amber-800 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded">
                        #{currentOrder.orderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Carrier: {currentOrder.carrier} · Tracking #{currentOrder.trackingNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => advanceTrackingSimulation(currentOrder.id)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                    title="Simulate the next courier delivery milestone and test real push alert"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                    <span>Simulate Next Courier Step</span>
                  </button>
                  <button
                    onClick={() => setDashboardTab('shipments')}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Full Live Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mini Status Timeline */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-900">Current Status: {currentOrder.status}</span>
                  <span className="text-xs text-stone-500 font-medium">
                    Estimated Delivery: <span className="text-stone-900 font-semibold">{currentOrder.estimatedDelivery}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-amber-700 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                  {stages.map((stg, i) => (
                    <div key={stg} className="text-left sm:text-center">
                      <span
                        className={`text-[11px] block font-medium ${
                          i <= currentStageIndex ? 'text-amber-900 font-semibold' : 'text-stone-400'
                        }`}
                      >
                        {stg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3-Column Highlights: Loyalty Perks, Gift Preferences, Quick Reorder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loyalty Vouchers Widget */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Active Promo Vouchers</span>
                  </span>
                  <button
                    onClick={() => setDashboardTab('rewards')}
                    className="text-xs text-stone-500 hover:text-stone-900"
                  >
                    View All →
                  </button>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Exclusive Patron Savings</h3>
                <p className="text-xs text-stone-600 mb-4">
                  Apply discounts directly to your shopping bag with one tap.
                </p>

                <div className="space-y-2.5">
                  {loyaltyRewards.slice(0, 2).map((rew) => (
                    <div
                      key={rew.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                            {rew.code}
                          </span>
                          <span className="text-xs font-semibold text-stone-900">{rew.discountDisplay}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 block mt-1">{rew.title}</span>
                      </div>
                      <button
                        onClick={() => {
                          const res = applyCoupon(rew.code);
                          alert(res.message);
                        }}
                        className="px-2.5 py-1 bg-stone-900 text-white rounded text-[11px] font-medium hover:bg-stone-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Earn 10 pts per $1 spent</span>
                <span className="text-amber-800 font-semibold">{user.loyaltyPoints} Available Pts</span>
              </div>
            </div>

            {/* Default Gift Packaging Preferences */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Gift className="w-4 h-4" />
                    <span>Personal Gift Profile</span>
                  </span>
                  <button
                    onClick={() => setDashboardTab('profile')}
                    className="text-xs text-stone-500 hover:text-stone-900"
                  >
                    Edit →
                  </button>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Bespoke Atelier Wrapping</h3>
                <p className="text-xs text-stone-600 mb-4">
                  Your orders automatically reflect your curated gift customization settings.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Preferred Velvet Ribbon</span>
                    <span className="font-medium text-stone-800">{user.giftPreferences.preferredRibbon}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Wax-Sealed Calligraphy Note</span>
                    <span className="text-emerald-700 font-medium">Included Always</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Eco-Friendly Silk Mulberry Wrap</span>
                    <span className="text-emerald-700 font-medium">Enabled</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Default Gift Note</span>
                    <p className="text-[11px] text-stone-700 italic mt-0.5 line-clamp-2">
                      "{user.giftPreferences.defaultGiftNote}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100">
                <button
                  onClick={() => setDashboardTab('profile')}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium transition-colors text-center"
                >
                  Manage Gift Profile Preferences
                </button>
              </div>
            </div>

            {/* Security Glance */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Account Security</span>
                  </span>
                  <button
                    onClick={() => setDashboardTab('security')}
                    className="text-xs text-stone-500 hover:text-stone-900"
                  >
                    Settings →
                  </button>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">2-Step Multi-Factor Protection</h3>
                <p className="text-xs text-stone-600 mb-4">
                  Account logins and sensitive address changes require one-time passcodes.
                </p>

                <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-900">2FA Status</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-800 block mt-1">
                    Method: {user.mfaMethod === 'sms' ? 'SMS Code (+1 555-***-9014)' : 'Authenticator App (TOTP)'}
                  </span>
                </div>

                <div className="text-xs text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment details encrypted with 3D Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real-time device sign-in alerts</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100">
                <button
                  onClick={() => setDashboardTab('security')}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium transition-colors text-center"
                >
                  View Security Audit Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SHIPMENTS & DELIVERY TRACKER */}
      {dashboardTab === 'shipments' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold font-mono">
                    #{currentOrder?.orderNumber}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">Live Status Tracker</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {currentOrder?.status}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Carrier: <span className="text-stone-800 font-semibold">{currentOrder?.carrier}</span> · Tracking ID: <span className="font-mono text-stone-800">{currentOrder?.trackingNumber}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => currentOrder && advanceTrackingSimulation(currentOrder.id)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                  title="Simulate the next courier step and trigger device push notification"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Simulate Next Courier Step</span>
                </button>
              </div>
            </div>

            {/* Delivery Destination & ETA Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-400 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Estimated Delivery</span>
                </span>
                <span className="font-serif text-lg font-bold text-stone-900 block mt-1">
                  {currentOrder?.estimatedDelivery}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">On Schedule · Express White-Glove</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-400 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </span>
                <span className="text-xs font-semibold text-stone-900 block mt-1">
                  {currentOrder?.recipientName}
                </span>
                <span className="text-[11px] text-stone-600 block">
                  {currentOrder?.shippingAddress.street}, {currentOrder?.shippingAddress.city}, {currentOrder?.shippingAddress.state} {currentOrder?.shippingAddress.postalCode}
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-400 block flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Gift Presentation</span>
                </span>
                <span className="text-xs font-semibold text-stone-900 block mt-1">
                  Signature Rigid Keepsake Box
                </span>
                <span className="text-[11px] text-stone-600 block">
                  Emerald Velvet Ribbon · Hand-Poured Wax Seal
                </span>
              </div>
            </div>

            {/* Interactive Visual Progress Stepper */}
            <div className="my-8">
              <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-6">
                Milestone Transit Progression
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-6 right-6 hidden sm:block h-1 bg-stone-200 z-0">
                  <div
                    className="h-full bg-amber-700 transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 sm:gap-2 relative z-10">
                  {stages.map((stageName, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stageName} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCompleted
                              ? isCurrent
                                ? 'bg-amber-800 text-white ring-4 ring-amber-100 shadow-md scale-110'
                                : 'bg-amber-700 text-white'
                              : 'bg-stone-100 text-stone-400 border border-stone-200'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <span
                            className={`text-xs block font-semibold ${
                              isCurrent ? 'text-amber-900' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                            }`}
                          >
                            {stageName}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5 font-bold animate-pulse">
                              Active Milestone
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Checkpoint Log */}
            <div className="mt-10 pt-6 border-t border-stone-200">
              <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-4">
                Detailed Carrier Checkpoint Logs
              </h3>

              <div className="space-y-4">
                {currentOrder?.trackingEvents.map((evt, idx) => (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                      evt.current
                        ? 'bg-amber-50/70 border-amber-200'
                        : evt.completed
                        ? 'bg-white border-stone-200'
                        : 'bg-stone-50/50 border-stone-100 text-stone-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                          evt.current
                            ? 'bg-amber-600 animate-ping'
                            : evt.completed
                            ? 'bg-amber-700'
                            : 'bg-stone-300'
                        }`}
                      ></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              evt.completed ? 'text-stone-900' : 'text-stone-400'
                            }`}
                          >
                            {evt.status}
                          </span>
                          {evt.current && (
                            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                              Current Point
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">{evt.description}</p>
                        <span className="text-[11px] text-stone-400 block mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{evt.location}</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-400 whitespace-nowrap">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER HISTORY */}
      {dashboardTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">Your Gift Order History</h2>
              <p className="text-xs text-stone-500">Review past orders, view invoices, and track delivery progress.</p>
            </div>
            <button
              onClick={() => setActiveView('store')}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm transition-all hover:border-amber-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">Order #{ord.orderNumber}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-stone-500">{ord.date}</span>
                      <span className="text-stone-300">·</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Recipient: <span className="text-stone-800 font-medium">{ord.recipientName}</span> · Paid with {ord.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-bold text-stone-900">${ord.total.toFixed(2)}</span>
                    <button
                      onClick={() => {
                        setActiveTrackingOrder(ord);
                        setDashboardTab('shipments');
                      }}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-stone-100 mt-4">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-stone-900">{item.product.name}</h4>
                          <span className="text-[11px] text-stone-500 block">
                            Qty: {item.quantity} · {item.giftWrapType} ({item.ribbonColor})
                          </span>
                          {item.giftCardMessage && (
                            <span className="text-[11px] text-stone-600 italic block mt-0.5">
                              Calligraphy Note: "{item.giftCardMessage}"
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-stone-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="block text-[11px] text-amber-800 font-medium hover:underline mt-1"
                        >
                          Reorder Gift
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOYALTY & REWARDS PROGRAM */}
      {dashboardTab === 'rewards' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Rewards Tier Status Banner */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block mb-1">
                  Aura Rewards Club
                </span>
                <h2 className="font-serif text-3xl font-bold">Gold Connoisseur Patron</h2>
                <p className="text-xs text-amber-100/90 mt-1 max-w-md">
                  Enjoy priority atelier handcrafting, complimentary velvet packaging, and earn 10 points for every dollar spent.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[160px]">
                <span className="text-xs text-amber-200 block">Available Points</span>
                <span className="font-serif text-3xl font-bold text-white block mt-0.5">{user.loyaltyPoints}</span>
                <span className="text-[11px] text-amber-200/80 block mt-1">Worth ${(user.loyaltyPoints / 20).toFixed(2)} Store Credit</span>
              </div>
            </div>

            {/* Next Tier Progress */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs text-amber-200 mb-1.5 font-medium">
                <span>Progress to Velvet Platinum Tier</span>
                <span>1,250 / 2,000 Points</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-300 h-full rounded-full" style={{ width: '62.5%' }}></div>
              </div>
            </div>
          </div>

          {/* Available Discounts & Vouchers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900">Your Exclusive Vouchers & Discounts</h3>
              <span className="text-xs text-stone-500">Tap code to copy or apply directly to your bag</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loyaltyRewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    reward.isUnlocked ? 'border-amber-200 shadow-sm' : 'border-stone-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {reward.code}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 mt-2">{reward.title}</h4>
                      <p className="text-xs text-stone-600 mt-1">{reward.description}</p>
                    </div>
                    <span className="font-serif text-xl font-bold text-amber-800 whitespace-nowrap">
                      {reward.discountDisplay}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Min spend: ${reward.minSpend}</span>
                    {reward.isUnlocked ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(reward.code)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          {copiedCode === reward.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode === reward.code ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => {
                            const res = applyCoupon(reward.code);
                            alert(res.message);
                          }}
                          className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors"
                        >
                          Apply to Bag
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const res = redeemReward(reward.id);
                          alert(res.message);
                        }}
                        className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded text-xs font-medium transition-colors"
                      >
                        Redeem for {reward.pointsCost} pts
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE & CONTACT INFORMATION (SECURE) */}
      {dashboardTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="pb-6 border-b border-stone-100">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Personal Contact Information</h2>
              <p className="text-xs text-stone-500 mt-1">
                Update your shipping addresses and personalized gift packaging preferences securely.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-3">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Primary Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Patron Username</label>
                    <input
                      type="text"
                      disabled
                      value={user.username}
                      className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-3">
                  Default Shipping & Gift Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Suite / Apartment</label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">State / Postal Code</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          required
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          placeholder="CA"
                          className="w-full px-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                        />
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="94107"
                          className="w-full px-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-3">
                  Default Gift Customization
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Preferred Velvet or Satin Ribbon Color
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(
                        [
                          'Lavender Satin',
                          'Blush Pink Satin',
                          'Golden Honey Satin',
                          'Emerald Velvet',
                          'Champagne Gold',
                          'Vintage Rose',
                        ] as const
                      ).map((ribbon) => (
                        <button
                          type="button"
                          key={ribbon}
                          onClick={() => setPreferredRibbon(ribbon)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                            preferredRibbon === ribbon
                              ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-800'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          {ribbon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Default Handwritten Gift Note
                    </label>
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md"
              >
                Save Contact & Gift Information Securely
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & 2FA SETTINGS */}
      {dashboardTab === 'security' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
          {/* Multi-Factor Authentication Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-start justify-between pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Multi-Factor Authentication (MFA)</h3>
                  <p className="text-xs text-stone-500">
                    Require a 6-digit one-time code in addition to your password for maximum account defense.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.mfaEnabled}
                  onChange={(e) => toggleMfa(e.target.checked, user.mfaMethod)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
              </label>
            </div>

            {user.mfaEnabled && (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
                  Verification Channel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toggleMfa(true, 'sms')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      user.mfaMethod === 'sms'
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-semibold text-stone-900">SMS Verification</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      Codes sent to {user.phone || '+1 555-***-9014'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleMfa(true, 'authenticator')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      user.mfaMethod === 'authenticator'
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <KeyRound className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-semibold text-stone-900">Authenticator App</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      Google Authenticator / 1Password TOTP
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="pb-4 border-b border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-900">Change Account Password</h3>
              <p className="text-xs text-stone-500">Ensure your password is at least 6 characters and unique.</p>
            </div>

            {passwordMsg && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {passwordMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Security & Access Logs */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">Security Audit & Session History</h3>
            <p className="text-xs text-stone-500 mb-4">Recent logins and authorized updates to your patron account.</p>

            <div className="space-y-3">
              {securityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{log.action}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {log.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {log.device} · {log.location} ({log.ip})
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PUSH NOTIFICATION ALERTS */}
      {dashboardTab === 'notifications' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-start justify-between pb-6 border-b border-stone-100">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Device Push Notifications</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Receive real-time carrier status updates and promotional discount alerts directly on your screen.
                </p>
              </div>
              <Bell className="w-6 h-6 text-amber-800" />
            </div>

            {/* Browser Permission Card */}
            <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-stone-900 block">System Browser Permission</span>
                <span className="text-[11px] text-stone-500 block">
                  Current Status:{' '}
                  <span
                    className={`font-semibold ${
                      pushPermission === 'granted' ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {pushPermission.toUpperCase()}
                  </span>
                </span>
              </div>
              {pushPermission !== 'granted' ? (
                <button
                  onClick={requestPushPermission}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  Grant Push Permission
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enabled</span>
                </span>
              )}
            </div>

            {/* Notification Channel Toggles */}
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Notification Subscriptions
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Real-time Shipment & Delivery Updates
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Instant alerts when package is crafting, dispatched, in transit, or out for delivery.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.shipments}
                    onChange={(e) => updatePushSettings({ shipments: e.target.checked })}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-700 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Promotional Offers & Holiday Discounts
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Receive early access drops and flash discount codes directly to your device.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.promotions}
                    onChange={(e) => updatePushSettings({ promotions: e.target.checked })}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-700 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Security & Account Protection Alerts
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Notifies you immediately when new device sign-ins or password resets happen.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.security}
                    onChange={(e) => updatePushSettings({ security: e.target.checked })}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-700 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Test Trigger Button */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-stone-500">Test your push notification setup right now:</span>
              <button
                onClick={() =>
                  sendPushNotification(
                    'Live Shipment Update: Out for Delivery',
                    'Your handcrafted decorative gift #AG-94812 is on courier vehicle and scheduled to arrive by 2:00 PM!',
                    'shipment'
                  )
                }
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span>Send Test Push Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI CHAT TRAINING & STORE KNOWLEDGE */}
      {dashboardTab === 'ai-training' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#1C1917] via-[#2A2420] to-[#1C1917] rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Website AI Model: Gemini 3.8 Flash + Store Knowledge Grounding</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Train AI Chat on Your Website Data
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Your website's AI concierge is grounded in your verified store catalog. Add custom knowledge entries, upload FAQs, or define bespoke ribbon & gift policies so customers receive immediate, 100% accurate responses.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsTrainingModalOpen(true)}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Open Full Training Studio</span>
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl text-xs transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                  <span>Test Live Customer Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">Trained Knowledge Topics</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-stone-900">{knowledgeBase.length}</span>
                <span className="text-xs text-emerald-700 font-semibold">
                  ({knowledgeBase.filter((k) => k.active).length} Active in Chat)
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Covers flower bouquets, ribbons, birthday hampers, and tracking.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">Grounding Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-emerald-700">100%</span>
                <span className="text-xs text-stone-500">Store Verified</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Responses prioritize website facts before answering customers.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">Sync Status</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-stone-900">Synchronized</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Updated knowledge syncs with backend server and localStorage instantly.
              </p>
            </div>
          </div>

          {/* n8n Webhook Workflow Card */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 border border-stone-700 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    n8n Webhook Integration
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-emerald-300 font-medium">Configured & Connected</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  n8n AI Workflow Webhook
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-mono bg-black/30 p-2.5 rounded-xl border border-stone-700 break-all">
                  {n8nConfig.webhookUrl}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setIsTrainingModalOpen(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Manage n8n Settings</span>
                </button>
                <a
                  href="https://brunda12.app.n8n.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-white/20"
                >
                  <span>Open n8n Canvas</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Trained Topics Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Currently Trained Website Topics
                </h3>
                <p className="text-xs text-stone-500">
                  These topics are currently injected into the AI Concierge's memory:
                </p>
              </div>
              <button
                onClick={() => setIsTrainingModalOpen(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>+ Add / Edit Topics</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeBase.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 hover:border-amber-400 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200/60">
                        Active in Chat
                      </span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-stone-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-2">
                      {item.content}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                    <span>{item.keywords.slice(0, 4).map((k) => `#${k}`).join(' ')}</span>
                    <button
                      onClick={() => setIsTrainingModalOpen(true)}
                      className="text-amber-800 hover:underline font-semibold"
                    >
                      Edit Topic
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
