import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Truck,
  MapPin,
  Gift,
  Building,
  Smartphone,
  Sparkles,
  QrCode,
  Tag,
  Clock,
  Calendar,
  Check,
  AlertCircle,
  Banknote,
  Send,
} from 'lucide-react';
import { Order } from '../types';
import { INDIAN_STATES, DELIVERY_SLOTS, lookupIndianPincode, AVAILABLE_COUPONS } from '../data/indianData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    user,
    placeOrder,
    setActiveView,
    setDashboardTab,
    setActiveTrackingOrder,
    formatPrice,
    deliveryPincode,
    setDeliveryPincode,
    selectedDeliverySlot,
    setSelectedDeliverySlot,
    deliveryDate,
    setDeliveryDate,
  } = useApp();

  const [step, setStep] = useState<'shipping' | 'payment' | 'mfa_challenge' | 'confirmed'>('shipping');

  // Indian personal & address details
  const [recipientName, setRecipientName] = useState(user?.fullName || 'Brunda M.');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [altPhone, setAltPhone] = useState(user?.backupPhone || '');
  const [flatNo, setFlatNo] = useState(user?.shippingAddress.flatNo || 'Flat 302, Rosewood Heights');
  const [areaStreet, setAreaStreet] = useState(user?.shippingAddress.areaStreet || '100ft Road, Indiranagar');
  const [landmark, setLandmark] = useState(user?.shippingAddress.landmark || 'Near Metro Station');
  const [city, setCity] = useState(user?.shippingAddress.city || 'Bengaluru');
  const [stateVal, setStateVal] = useState(user?.shippingAddress.state || 'Karnataka');
  const [pincode, setPincode] = useState(deliveryPincode || '560038');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Delivery slot & date
  const [slot, setSlot] = useState(selectedDeliverySlot);
  const [dateChoice, setDateChoice] = useState('Tomorrow');

  // Pincode validation state
  const [pincodeInfo, setPincodeInfo] = useState<ReturnType<typeof lookupIndianPincode>>(() =>
    lookupIndianPincode(pincode)
  );

  // Auto-detect city & state when pincode changes
  useEffect(() => {
    const info = lookupIndianPincode(pincode);
    setPincodeInfo(info);
    if (info.valid) {
      if (info.city && (!city || city === 'Bengaluru' || city === 'San Francisco')) {
        setCity(info.city);
      }
      if (info.state && (!stateVal || stateVal === 'Karnataka' || stateVal === 'CA')) {
        setStateVal(info.state);
      }
      setDeliveryPincode(pincode);
    }
  }, [pincode]);

  // Payment states
  const [paymentCategory, setPaymentCategory] = useState<'upi_apps' | 'upi_qr' | 'upi_id' | 'cod' | 'netbanking' | 'cards'>('upi_apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred'>('phonepe');
  const [vpaId, setVpaId] = useState('brunda12@okaxis');
  const [isVpaVerified, setIsVpaVerified] = useState(true);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('412');
  const [cardHolder, setCardHolder] = useState(recipientName);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // 3D Secure / OTP verification challenge
  const [bankOtp, setBankOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Confirmed Order result
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setSelectedDeliverySlot(slot);
    setDeliveryDate(dateChoice);
    setStep('payment');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentCategory === 'cod') {
      // Direct placement for COD with OTP verification step
      setStep('mfa_challenge');
    } else if (paymentCategory === 'upi_qr') {
      setStep('mfa_challenge');
    } else {
      setStep('mfa_challenge');
    }
  };

  const handleVerifyBankOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    const paymentLabel =
      paymentCategory === 'upi_apps'
        ? `UPI (${selectedUpiApp.toUpperCase()})`
        : paymentCategory === 'upi_qr'
        ? 'UPI QR Code (Scan & Pay)'
        : paymentCategory === 'upi_id'
        ? `UPI VPA (${vpaId})`
        : paymentCategory === 'cod'
        ? 'Cash on Delivery (COD)'
        : paymentCategory === 'netbanking'
        ? `Net Banking (${selectedBank})`
        : 'Credit / Debit Card (RuPay)';

    setTimeout(() => {
      setIsVerifyingOtp(false);
      const newOrder = placeOrder({
        recipientName,
        phone,
        altPhone,
        flatNo,
        areaStreet,
        landmark,
        city,
        state: stateVal,
        pincode,
        deliverySlot: slot,
        deliveryDate: dateChoice,
        paymentMethod: paymentLabel,
        upiId: paymentCategory === 'upi_id' ? vpaId : undefined,
        cardNumber: paymentCategory === 'cards' ? cardNumber : undefined,
      });

      setCreatedOrder(newOrder);
      setStep('confirmed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Aura Artisan Checkout
              </h2>
              <p className="text-[11px] text-stone-500">
                Handcrafted in India • Express Delivery • 100% Secure Checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step !== 'confirmed' && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
                <span className={`px-2 py-0.5 rounded-full font-bold ${step === 'shipping' ? 'bg-amber-700 text-white' : 'bg-stone-100'}`}>
                  1. Delivery
                </span>
                <span>→</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${step === 'payment' || step === 'mfa_challenge' ? 'bg-amber-700 text-white' : 'bg-stone-100'}`}>
                  2. Payment (UPI)
                </span>
              </div>
            )}

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: INDIAN ADDRESS, PINCODE & DELIVERY SLOTS */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Order Quick Summary Header */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-xs font-semibold text-stone-800">
                    Ordering {cart.reduce((sum, i) => sum + i.quantity, 0)} Handcrafted Items
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <span>Order Total:</span>
                  <span className="text-base text-amber-900 font-serif font-bold">
                    {formatPrice(cartTotal)}
                  </span>
                  {cartDiscount > 0 && (
                    <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-sans font-bold">
                      Saved {formatPrice(cartDiscount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>1. Recipient & Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Brunda M."
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Alternate / Coordination Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="+91 91234 56789 (For surprise deliveries)"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={whatsappUpdates}
                        onChange={(e) => setWhatsappUpdates(e.target.checked)}
                        className="rounded text-amber-700 focus:ring-amber-700 w-4 h-4"
                      />
                      <span>Receive real-time delivery updates & photos on WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Pincode */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>2. Delivery Address in India</span>
                </h3>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Flat / House No. / Building / Floor *
                      </label>
                      <input
                        type="text"
                        required
                        value={flatNo}
                        onChange={(e) => setFlatNo(e.target.value)}
                        placeholder="e.g. Flat 302, 3rd Floor, Rosewood Apts"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Street Address / Area / Colony *
                      </label>
                      <input
                        type="text"
                        required
                        value={areaStreet}
                        onChange={(e) => setAreaStreet(e.target.value)}
                        placeholder="e.g. 100ft Road, Indiranagar"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Metro Station / Temple"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        State *
                      </label>
                      <select
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 6-Digit Pincode with Live Verification */}
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Indian PIN Code (6 Digits) *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full sm:w-48">
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 560038"
                          className="w-full px-3 py-2 text-xs font-mono font-bold tracking-wider bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                        />
                        {pincodeInfo.valid && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-2.5" />
                        )}
                      </div>

                      {pincodeInfo.valid ? (
                        <div className="flex-1 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Serviceable:</strong> {pincodeInfo.city}, {pincodeInfo.state} • Estimated delivery: <strong>{pincodeInfo.deliveryDays}</strong> via Blue Dart / Delhivery Express.
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Enter 6-digit PIN code to check instant delivery timing and courier route.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Time Slot Selection ("Nearby time the delivery will be held") */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>3. Delivery Time Slot ("Nearby Delivery Time")</span>
                  </h3>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Select your preferred hours
                  </span>
                </div>

                {/* Delivery Date Options */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Delivery Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Tomorrow', 'Day After Tomorrow', 'Custom Milestone Date'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDateChoice(d)}
                        className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                          dateChoice === d
                            ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DELIVERY_SLOTS.map((s) => {
                    const isSelected = slot === `${s.name} (${s.timeRange})`;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSlot(`${s.name} (${s.timeRange})`)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-amber-700 bg-amber-50/80 shadow-xs ring-1 ring-amber-700'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                            <span>{s.icon}</span>
                            <span>{s.name}</span>
                          </span>
                          {s.extraFee && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                              +₹{s.extraFee}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-stone-700 font-semibold">
                          {s.timeRange}
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {s.tag}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    <span>Apply Discount Coupon</span>
                  </h4>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Remove ({appliedCoupon.code})
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. AURA10, FIRSTGIFT)"
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl text-stone-900 uppercase focus:ring-2 focus:ring-amber-700"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponSuccess && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{couponSuccess}</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </p>
                )}

                {/* Available Quick Coupons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AVAILABLE_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        applyCoupon(c.code);
                        setCouponSuccess(`Coupon ${c.code} applied!`);
                        setCouponError('');
                      }}
                      className={`text-[10px] px-2 py-1 rounded-lg border font-mono font-bold transition-all ${
                        appliedCoupon?.code === c.code
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`})
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel & Back to Store
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Proceed to Payment (UPI / Cards / COD)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: INDIAN PAYMENT METHODS (UPI, QR, NET BANKING, COD) */}
          {step === 'payment' && (
            <form onSubmit={handleInitiatePayment} className="space-y-6">
              {/* Total Banner */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-stone-500 block">Total Payable Amount</span>
                  <span className="text-xl font-serif font-bold text-stone-900">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Delivery to:</span>
                  <span className="text-xs font-bold text-stone-800">
                    {city}, {pincode}
                  </span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentCategory('upi_apps')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentCategory === 'upi_apps'
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <span>📱</span>
                      <span>UPI Apps</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      GPay, PhonePe, Paytm
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentCategory('upi_qr')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentCategory === 'upi_qr'
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-700" />
                      <span>Scan UPI QR</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Scan with any UPI App
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentCategory('cod')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentCategory === 'cod'
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span>Cash on Delivery</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Pay at Doorstep (COD)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentCategory('upi_id')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentCategory === 'upi_id'
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <span>@</span>
                      <span>Enter UPI ID</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      VPA (e.g. name@upi)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentCategory('cards')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentCategory === 'cards'
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-700" />
                      <span>Cards & RuPay</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Debit, Credit, RuPay
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentCategory('netbanking')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentCategory === 'netbanking'
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-amber-700" />
                      <span>Net Banking</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      SBI, HDFC, ICICI, etc.
                    </span>
                  </button>
                </div>
              </div>

              {/* PAYMENT DETAILS CONTENT */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                {/* 1. UPI APPS */}
                {paymentCategory === 'upi_apps' && (
                  <div className="space-y-4">
                    <p className="text-xs text-stone-600 font-medium">
                      Select your preferred UPI app for instant one-tap authorization:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                        { id: 'gpay', name: 'Google Pay', icon: '🔵' },
                        { id: 'paytm', name: 'Paytm UPI', icon: '🔷' },
                        { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳' },
                        { id: 'cred', name: 'CRED UPI', icon: '⚡' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id as any)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            selectedUpiApp === app.id
                              ? 'border-amber-700 bg-amber-50 font-bold ring-1 ring-amber-700'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-lg">{app.icon}</span>
                          <span className="text-xs text-stone-900">{app.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Your UPI app will be requested to approve {formatPrice(cartTotal)} via NPCI secure gateway.
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. SCAN UPI QR CODE */}
                {paymentCategory === 'upi_qr' && (
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    {/* Simulated Dynamic UPI QR */}
                    <div className="p-3 bg-white border-2 border-stone-800 rounded-2xl shadow-md shrink-0 flex flex-col items-center">
                      <div className="w-36 h-36 bg-stone-900 rounded-lg flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                        {/* QR Grid Pattern Simulation */}
                        <div className="absolute inset-2 grid grid-cols-5 gap-1 opacity-80">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${
                                (i % 2 === 0 || i % 3 === 0) ? 'bg-amber-300' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="relative z-10 bg-stone-900 px-2 py-1 rounded text-[10px] font-mono font-bold tracking-widest text-amber-300 border border-amber-400">
                          SCAN & PAY
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-stone-800 mt-1.5 font-mono">
                        {formatPrice(cartTotal)}
                      </span>
                      <span className="text-[9px] text-stone-400">VPA: aura.artisan@okhdfc</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-900">
                        Scan QR with Any Indian UPI App
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Open Google Pay, PhonePe, Paytm, or BHIM, point your phone camera at this QR code, and authorize {formatPrice(cartTotal)}.
                      </p>
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
                        Instant payment confirmation. No manual screenshot upload required!
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ENTER UPI ID / VPA */}
                {paymentCategory === 'upi_id' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-stone-700">
                      Enter UPI ID / VPA *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={vpaId}
                        onChange={(e) => setVpaId(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                        className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-700"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVpaVerified(true)}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
                      >
                        Verify
                      </button>
                    </div>
                    {isVpaVerified && (
                      <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified VPA. A payment collect request will be sent to your app.</span>
                      </p>
                    )}
                  </div>
                )}

                {/* 4. CASH ON DELIVERY (COD) */}
                {paymentCategory === 'cod' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Cash on Delivery is Available for Pincode {pincode}!</span>
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Pay {formatPrice(cartTotal)} via Cash or scan the delivery associate’s UPI QR on arrival at {flatNo}, {city}.
                      </p>
                    </div>
                    <p className="text-xs text-stone-500">
                      We will verify your order via SMS / WhatsApp OTP before dispatching from the atelier.
                    </p>
                  </div>
                )}

                {/* 5. CARDS (RUPAY, VISA, MASTERCARD) */}
                {paymentCategory === 'cards' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-stone-700">Card Number *</label>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        RuPay / Visa / Mastercard
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. NET BANKING */}
                {paymentCategory === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-stone-700">
                      Select Your Bank *
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  ← Back to Address Details
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>
                    Pay {formatPrice(cartTotal)} ({paymentCategory === 'cod' ? 'Confirm COD' : 'Authorize via Gateway'})
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 3D SECURE / OTP CHALLENGE SIMULATION */}
          {step === 'mfa_challenge' && (
            <div className="py-6 max-w-md mx-auto text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 mx-auto shadow-inner">
                <ShieldCheck className="w-7 h-7 text-amber-700" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {paymentCategory === 'cod' ? 'Order Verification OTP' : 'NPCI / Bank 3D Secure Verification'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  A 6-digit confirmation code was sent to <strong>{phone}</strong> to confirm this order.
                </p>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-mono">
                Order Amount: <strong>{formatPrice(cartTotal)}</strong> • Delivery Slot: <strong>{slot}</strong>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2">
                {bankOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const updated = [...bankOtp];
                      updated[idx] = e.target.value;
                      setBankOtp(updated);
                    }}
                    className="w-11 h-12 text-center text-base font-bold font-mono bg-white border border-stone-300 rounded-xl shadow-xs focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                ))}
              </div>

              <p className="text-[11px] text-stone-400">
                Simulation tip: Code <strong>482910</strong> prefilled for instant checkout.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isVerifyingOtp}
                  onClick={handleVerifyBankOtp}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Verify & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="py-6 max-w-lg mx-auto text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  🎉 Order Placed Successfully!
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Thank You, {recipientName}!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Your handcrafted bouquet & gifts are queued for artisan assembly at our atelier.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Order Number:</span>
                  <span className="font-mono font-bold text-stone-900">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Scheduled Delivery Slot:</span>
                  <span className="font-semibold text-amber-800">{createdOrder.deliverySlot || slot}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="font-medium text-stone-800 text-right max-w-xs truncate">
                    {flatNo}, {city} - {pincode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Courier Partner:</span>
                  <span className="font-semibold text-stone-800">Blue Dart Express (India)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-900 font-bold">Total Paid:</span>
                  <span className="font-serif font-bold text-sm text-stone-900">
                    {formatPrice(createdOrder.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveView('dashboard');
                    setDashboardTab('shipments');
                    setActiveTrackingOrder(createdOrder);
                  }}
                  className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Track Live Delivery Status</span>
                </button>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveView('store');
                  }}
                  className="py-3 px-5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-semibold rounded-xl text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
