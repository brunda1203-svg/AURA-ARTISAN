import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, ShoppingBag, ArrowRight, Trash2, Sparkles } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    removeFromWishlist,
    addToCart,
    setIsCartOpen,
    formatPrice,
    setQuickViewProduct,
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCFBF9] shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-1.5">
                  Your Wishlist
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {wishlist.length}
                  </span>
                </h2>
                <p className="text-[11px] text-stone-500">Saved handcrafted items & keepsakes</p>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800 mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Save your favorite pipe cleaner flowers, chocolate bouquets, satin ribbon roses, or photo frames here!
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-md"
                >
                  Explore Handcrafted Collections
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-white border border-stone-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex gap-3.5 items-center group"
                >
                  {/* Image */}
                  <div
                    onClick={() => {
                      setQuickViewProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 cursor-pointer relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500/90 text-stone-950 font-bold text-[9px] rounded-sm">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider block truncate">
                      {product.category}
                    </span>
                    <h4
                      onClick={() => {
                        setQuickViewProduct(product);
                        setIsWishlistOpen(false);
                      }}
                      className="text-xs font-bold text-stone-900 line-clamp-1 cursor-pointer hover:text-amber-800 transition-colors"
                    >
                      {product.name}
                    </h4>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-stone-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          setIsCartOpen(true);
                          setIsWishlistOpen(false);
                        }}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-white/90 space-y-2">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => addToCart(p, 1));
                  setIsCartOpen(true);
                  setIsWishlistOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-xl text-xs font-bold tracking-wide uppercase shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Move All ({wishlistedProducts.length}) to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
