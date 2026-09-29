import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Bell,
  User as UserIcon,
  ShieldCheck,
  Search,
  PackageCheck,
  Award,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles,
  Heart,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    cart,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    activeView,
    setActiveView,
    setDashboardTab,
    unreadCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    pushPermission,
    requestPushPermission,
    setIsTrainingModalOpen,
    setIsChatOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/70">
      {/* Top Announcement Bar */}
      <div className="bg-[#1C1917] text-[#FAF8F5] text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-amber-200 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>🇮🇳 All-India Express Delivery • Handcrafted Bouquets & Keepsakes • Use Code</span>
          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-amber-300">AURA10</span>
          <span>for 10% OFF</span>
        </span>
        <span className="hidden md:inline text-stone-500">|</span>
        <span className="hidden md:inline text-stone-300">Instant UPI & COD Accepted Across India</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('store');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#2D2A26] flex items-center justify-center text-[#F3EFEA] font-serif font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="font-serif text-2xl tracking-wider text-stone-900 block font-semibold leading-tight">
                  AURA ARTISAN
                </span>
                <span className="text-[10px] tracking-[0.2em] text-stone-500 uppercase block font-sans">
                  Decorative Gifts & Atelier
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => setActiveView('store')}
              className={`text-sm tracking-wide transition-colors ${
                activeView === 'store'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-800 pb-0.5'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Gift Collection
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                } else {
                  setActiveView('dashboard');
                  setDashboardTab('shipments');
                }
              }}
              className={`text-sm tracking-wide transition-colors flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-800 pb-0.5'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-stone-500" />
              <span>Live Shipment Tracker</span>
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                } else {
                  setActiveView('dashboard');
                  setDashboardTab('rewards');
                }
              }}
              className="text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Loyalty & Perks</span>
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                } else {
                  setActiveView('dashboard');
                  setDashboardTab('overview');
                }
              }}
              className={`text-sm tracking-wide transition-colors ${
                activeView === 'dashboard'
                  ? 'text-stone-900 font-medium'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Personalized Dashboard
            </button>
            <button
              onClick={() => setIsTrainingModalOpen(true)}
              className="text-xs tracking-wide text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1.5 border border-amber-300/80 shadow-xs"
              title="Train chatbot on your website products, cards, and policies"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Train AI Chat</span>
            </button>
          </nav>

          {/* Right Action Icons (Search, Notifications, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:block w-48 lg:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts, materials..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100/80 border border-stone-200/80 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-700 focus:bg-white placeholder:text-stone-400 text-stone-800"
              />
            </div>

            {/* Push Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-stone-700 hover:text-stone-900 relative rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">Device Notifications</h4>
                      <p className="text-[11px] text-stone-500">Live shipment updates & promotions</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {pushPermission !== 'granted' && (
                    <div className="p-3 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-amber-900">
                        Enable browser push for delivery alerts on your screen
                      </div>
                      <button
                        onClick={requestPushPermission}
                        className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded text-[11px] font-medium whitespace-nowrap shadow-sm"
                      >
                        Enable Push
                      </button>
                    </div>
                  )}

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-stone-500">No notifications yet.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.orderId) {
                              setActiveView('dashboard');
                              setDashboardTab('shipments');
                              setIsNotifOpen(false);
                            } else if (notif.promoCode) {
                              setActiveView('dashboard');
                              setDashboardTab('rewards');
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3 text-left hover:bg-stone-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-stone-400 whitespace-nowrap">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                    <button
                      onClick={() => {
                        setIsNotifOpen(false);
                        setActiveView('dashboard');
                        setDashboardTab('notifications');
                      }}
                      className="text-xs font-medium text-amber-800 hover:underline"
                    >
                      Manage Alert Preferences in Settings →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-stone-700 hover:text-rose-600 relative rounded-full hover:bg-rose-50/60 transition-colors focus:outline-none"
              title="View Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 text-stone-700 hover:text-rose-600" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-stone-700 hover:text-stone-900 relative rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Account / Profile Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 transition-colors border border-stone-200/80"
                  aria-label="User account menu"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-medium text-stone-800 pr-1">
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-in fade-in duration-100">
                    <div className="p-3.5 bg-stone-50 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{user.fullName}</p>
                          <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Status</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>MFA Protected</span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Aura Points</span>
                        <span className="text-amber-800 font-semibold">{user.loyaltyPoints} pts</span>
                      </div>
                    </div>

                    <div className="py-1 text-xs text-stone-700 divide-y divide-stone-100">
                      <button
                        onClick={() => {
                          setActiveView('dashboard');
                          setDashboardTab('overview');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-stone-400" />
                        <span>Personalized Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('dashboard');
                          setDashboardTab('shipments');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-stone-400" />
                        <span>Live Shipments Tracker</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('dashboard');
                          setDashboardTab('security');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-stone-400" />
                        <span>Security & 2FA Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setActiveView('store');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Gift Collection
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              } else {
                setActiveView('dashboard');
                setDashboardTab('shipments');
              }
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Live Shipment Tracker
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              } else {
                setActiveView('dashboard');
                setDashboardTab('rewards');
              }
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Loyalty Rewards & Perks
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              } else {
                setActiveView('dashboard');
                setDashboardTab('overview');
              }
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Personalized Dashboard
          </button>
        </div>
      )}
    </header>
  );
};
