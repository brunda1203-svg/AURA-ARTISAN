import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { X, Star, ShieldCheck, Gift, Check, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, user } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [giftWrapType, setGiftWrapType] = useState<
    'Signature Velvet Box' | 'Botanical Mulberry Paper' | 'Minimalist Linen' | 'Scalloped Floristry Paper'
  >(
    product?.category === 'Pipe Cleaner Bouquets' ? 'Scalloped Floristry Paper' : 'Signature Velvet Box'
  );
  const [ribbonColor, setRibbonColor] = useState<
    'Emerald Velvet' | 'Champagne Gold' | 'Vintage Rose' | 'Lavender Satin' | 'Blush Pink Satin' | 'Golden Honey Satin'
  >(
    (user?.giftPreferences.preferredRibbon as any) || 'Lavender Satin'
  );
  const [waxSeal, setWaxSeal] = useState(true);
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [giftCardMessage, setGiftCardMessage] = useState(user?.giftPreferences.defaultGiftNote || '');

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, {
      giftWrapType,
      ribbonColor,
      waxSeal,
      giftCardMessage,
      recipientName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Pane */}
        <div className="md:w-1/2 bg-stone-100 relative min-h-[260px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-stone-200/60 text-xs">
            <span className="font-semibold text-stone-900 block">{product.artisanOrigin}</span>
            <span className="text-[11px] text-stone-600 block mt-0.5">{product.material}</span>
          </div>
        </div>

        {/* Right Details & Personalization Pane */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-stone-500">
              <span>{product.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating} ({product.reviewsCount} reviews)</span>
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900">{product.name}</h2>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-2xl font-bold text-stone-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">${product.originalPrice}</span>
              )}
              <span className="text-xs text-emerald-700 font-medium ml-2">In Stock · Ready to Gift Wrap</span>
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">{product.description}</p>

            {/* Artisan Story */}
            <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-950">
              <span className="font-semibold block mb-0.5">Master Craftsmanship Story:</span>
              <p className="text-[11px] text-stone-700 leading-relaxed">{product.story}</p>
            </div>

            {/* Gift Personalization Form */}
            <div className="mt-5 space-y-4 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-800" />
                <span>Personalize Gift Packaging</span>
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Brunda M."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Signature Velvet or Satin Ribbon Color
                </label>
                <div className="grid grid-cols-3 gap-1.5">
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
                      onClick={() => setRibbonColor(ribbon)}
                      className={`p-2 rounded-lg border text-[11px] font-medium text-center transition-all ${
                        ribbonColor === ribbon
                          ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-800'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {ribbon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Calligraphy Gift Card Note (Included)
                </label>
                <textarea
                  rows={2}
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  placeholder="Write your heartfelt note..."
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waxSeal}
                  onChange={(e) => setWaxSeal(e.target.checked)}
                  className="rounded border-stone-300 text-amber-800 focus:ring-amber-700"
                />
                <span className="text-xs text-stone-700">Add hand-poured metallic wax seal to gift note</span>
              </label>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors text-xs font-bold"
              >
                -
              </button>
              <span className="px-3 py-2 text-xs font-semibold text-stone-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors text-xs font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Add to Bag (${(product.price * quantity).toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
