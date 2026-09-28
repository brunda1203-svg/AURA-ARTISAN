import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Star,
  Gift,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Heart,
  Eye,
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    addToCart,
    setQuickViewProduct,
    setActiveView,
    setDashboardTab,
    isAuthenticated,
    setIsAuthModalOpen,
  } = useApp();

  const categories = [
    'All',
    'Pipe Cleaner Bouquets',
    'Birthday Cards & Keepsakes',
    'Gift Hampers',
    'Keepsake Vessels',
    'Botanical & Glass',
    'Candles & Scents',
    'Brass & Metalcraft',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F3EFEA] to-[#FAF8F5] border-b border-stone-200/60 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Artisan Handcrafted Gifting Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight max-w-3xl mx-auto leading-[1.15]">
            Curated Decorative Gifts <br className="hidden sm:inline" />
            <span className="italic font-normal text-stone-700">for Life’s Cherished Milestones</span>
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
            Every decorative keepsake is sculpted by master artisans, nestled in our signature rigid velvet gift box, and accompanied by a wax-sealed handwritten calligraphy card.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Gift Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthModalOpen(true);
                } else {
                  setActiveView('dashboard');
                  setDashboardTab('shipments');
                }
              }}
              className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Track Live Delivery</span>
            </button>
          </div>

          {/* Value Props Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-stone-200/80 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3 p-2">
              <Gift className="w-5 h-5 text-amber-800 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">Velvet Gift Packaging</span>
                <span className="text-[11px] text-stone-500 block">Complimentary wax seal note</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <Truck className="w-5 h-5 text-amber-800 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">Live Shipment Tracking</span>
                <span className="text-[11px] text-stone-500 block">Real-time transit milestones</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">2FA Multi-Factor Shield</span>
                <span className="text-[11px] text-stone-500 block">Protected account & checkout</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <Sparkles className="w-5 h-5 text-amber-800 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">15% Loyalty Discount</span>
                <span className="text-[11px] text-stone-500 block">Use promo code GIFT15</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900">Artisan Gift Offerings</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {filteredProducts.length} handcrafted decorative pieces
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-md text-stone-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                      Atelier Pick
                    </span>
                  )}

                  {/* Quick View Button overlay */}
                  <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="px-3.5 py-2 bg-white text-stone-900 rounded-xl text-xs font-semibold shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-800" />
                      <span>Personalize & View</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span>{product.category}</span>
                    <span className="flex items-center gap-1 text-amber-800 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{product.rating}</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => setQuickViewProduct(product)}
                    className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 cursor-pointer transition-colors leading-snug line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-2 text-[11px] text-stone-400">
                    <span>Origin: {product.artisanOrigin}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="font-serif text-xl font-bold text-stone-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-stone-400 line-through ml-1.5">${product.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-300" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
