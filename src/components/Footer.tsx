import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setDashboardTab, isAuthenticated, setIsAuthModalOpen } = useApp();

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#2D2A26] flex items-center justify-center text-amber-200 font-serif font-bold text-lg border border-amber-200/20">
                A
              </div>
              <span className="font-serif text-xl tracking-wider text-white font-semibold">
                AURA ARTISAN
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Handcrafted decorative gifts, botanical glass cloches, and heirloom vessels designed to celebrate life's most meaningful moments.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Factor 2FA Account Protection</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-4 font-sans">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => {
                    if (!isAuthenticated) setIsAuthModalOpen(true);
                    else {
                      setActiveView('dashboard');
                      setDashboardTab('shipments');
                    }
                  }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Live Shipment Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isAuthenticated) setIsAuthModalOpen(true);
                    else {
                      setActiveView('dashboard');
                      setDashboardTab('orders');
                    }
                  }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Order History & Invoices
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isAuthenticated) setIsAuthModalOpen(true);
                    else {
                      setActiveView('dashboard');
                      setDashboardTab('profile');
                    }
                  }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Profile & Contact Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isAuthenticated) setIsAuthModalOpen(true);
                    else {
                      setActiveView('dashboard');
                      setDashboardTab('security');
                    }
                  }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Multi-Factor Security Center
                </button>
              </li>
            </ul>
          </div>

          {/* Rewards & Gifting */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-4 font-sans">
              Loyalty & Privileges
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => {
                    if (!isAuthenticated) setIsAuthModalOpen(true);
                    else {
                      setActiveView('dashboard');
                      setDashboardTab('rewards');
                    }
                  }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Aura Rewards Club
                </button>
              </li>
              <li>
                <span className="text-stone-400">Promo Code: GIFT15 (15% Off)</span>
              </li>
              <li>
                <span className="text-stone-400">Complimentary Velvet Boxes</span>
              </li>
              <li>
                <span className="text-stone-400">Handwritten Calligraphy Cards</span>
              </li>
            </ul>
          </div>

          {/* Atelier Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-4 font-sans">
              Our Artisan Pledge
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              30-day satisfaction guarantee on all handcrafted decor. Temperature-controlled express transit with signature confirmation.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-stone-300">
              <span className="font-semibold text-white block">Atelier Workshop:</span>
              <span>742 Evergreen Artisan Way, San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Aura Artisan Decor & Gifts. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Gifting</span>
            <span>·</span>
            <span>Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
