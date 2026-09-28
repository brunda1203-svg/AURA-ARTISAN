/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProductCatalog } from './components/ProductCatalog';
import { DashboardView } from './components/DashboardView';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SupportChatbot } from './components/SupportChatbot';
import { N8nOfficialWidget } from './components/N8nOfficialWidget';
import { KnowledgeTrainingModal } from './components/KnowledgeTrainingModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    activeView,
    quickViewProduct,
    setQuickViewProduct,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {activeView === 'store' && <ProductCatalog />}
        {activeView === 'dashboard' && <DashboardView />}
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <SupportChatbot />
      <N8nOfficialWidget />
      <KnowledgeTrainingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
