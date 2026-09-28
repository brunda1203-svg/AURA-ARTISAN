import React, { useState } from 'react';
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
} from 'lucide-react';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    user,
    placeOrder,
    setActiveView,
    setDashboardTab,
    setActiveTrackingOrder,
  } = useApp();

  const [step, setStep] = useState<'shipping' | 'payment' | 'mfa_challenge' | 'confirmed'>('shipping');

  // Shipping details state
  const [recipientName, setRecipientName] = useState(user?.fullName || 'Brunda M.');
  const [street, setStreet] = useState(user?.shippingAddress.street || '742 Evergreen Artisan Way');
  const [apartment, setApartment] = useState(user?.shippingAddress.apartment || 'Suite 4B');
  const [city, setCity] = useState(user?.shippingAddress.city || 'San Francisco');
  const [stateVal, setStateVal] = useState(user?.shippingAddress.state || 'CA');
  const [postalCode, setPostalCode] = useState(user?.shippingAddress.postalCode || '94107');

  // Payment details state
  const [paymentMethod, setPaymentMethod] = useState<
    'Credit Card (3D Secure)' | 'Apple Pay' | 'Google Pay' | 'Instant Bank / UPI'
  >('Credit Card (3D Secure)');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState(user?.fullName || 'Brunda M.');

  // 3D Secure 2FA verification challenge
  const [bankOtp, setBankOtp] = useState(['7', '3', '9', '1', '0', '2']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Confirmed Order result
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Launch 3D-Secure 2FA verification
    setStep('mfa_challenge');
  };

  const handleVerifyBankOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      const newOrder = placeOrder({
        recipientName,
        shippingAddress: {
          street,
          apartment,
          city,
          state: stateVal,
          postalCode,
          country: 'United States',
        },
        paymentMethod,
        cardNumber,
      });
      setCreatedOrder(newOrder);
      setStep('confirmed');
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('shipping');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center text-xs font-serif font-bold">
              A
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {step === 'confirmed' ? 'Order Confirmed' : 'Secure Atelier Checkout'}
              </h3>
              <span className="text-[11px] text-stone-500 block">
                {step === 'shipping'
                  ? 'Step 1 of 3: Delivery & Recipient Information'
                  : step === 'payment'
                  ? 'Step 2 of 3: Select Payment Gateway'
                  : step === 'mfa_challenge'
                  ? 'Step 3 of 3: 3D-Secure 2FA Bank Authentication'
                  : 'Handcrafted packaging & tracking queued'}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: SHIPPING & RECIPIENT */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Apt / Suite</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State / Zip</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      required
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      placeholder="CA"
                      className="w-full px-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                    />
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="94107"
                      className="w-full px-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <span>
                  All items are packaged in individual velvet boxes with customized calligraphy gift notes.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Payment Gateway (${cartTotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY SELECTION */}
          {step === 'payment' && (
            <form onSubmit={handleInitiatePayment} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Credit Card (3D Secure)', icon: CreditCard, label: 'Credit / Debit Card' },
                    { id: 'Apple Pay', icon: Smartphone, label: 'Apple Pay (Biometric)' },
                    { id: 'Google Pay', icon: Smartphone, label: 'Google Pay' },
                    { id: 'Instant Bank / UPI', icon: Building, label: 'Instant Bank / UPI' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-amber-800 bg-amber-50 text-amber-950 ring-1 ring-amber-800 font-semibold'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-800" />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {paymentMethod === 'Credit Card (3D Secure)' && (
                <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Security CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary line */}
              <div className="flex items-center justify-between py-2 border-t border-stone-100 text-xs text-stone-600">
                <span>Total Charge Amount</span>
                <span className="font-serif text-lg font-bold text-stone-900">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Verify with 3D Secure (${cartTotal.toFixed(2)})</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 3D SECURE 2FA CARD VERIFICATION CHALLENGE */}
          {step === 'mfa_challenge' && (
            <form onSubmit={handleVerifyBankOtp} className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Verified by Visa / Mastercard ID Check
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  A high-security one-time SMS verification passcode was sent to confirm your payment of{' '}
                  <span className="font-bold text-stone-800">${cartTotal.toFixed(2)}</span>.
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-center justify-between">
                <span>Bank Simulation Code:</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  739102
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Enter 6-Digit Bank OTP
                </label>
                <div className="flex justify-center gap-2">
                  {bankOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...bankOtp];
                        newOtp[idx] = e.target.value.slice(-1);
                        setBankOtp(newOtp);
                      }}
                      className="w-10 h-11 text-center font-mono font-bold text-base bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {isVerifyingOtp ? (
                  <span>Authorizing 3D Secure Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Authorize Payment & Place Order</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="text-xs text-stone-400 hover:text-stone-600 block mx-auto"
              >
                Cancel and return to payment methods
              </button>
            </form>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                  Payment Authorized via 3D Secure
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Your order <span className="font-bold text-stone-900">#{createdOrder.orderNumber}</span> has been received and queued in our master atelier.
                </p>
              </div>

              {/* Order Glance Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Carrier:</span>
                  <span className="font-semibold text-stone-900">{createdOrder.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tracking Number:</span>
                  <span className="font-mono text-stone-900">{createdOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Recipient:</span>
                  <span className="font-medium text-stone-900">{createdOrder.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Estimated Delivery:</span>
                  <span className="text-emerald-700 font-semibold">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                  <span>Total Paid:</span>
                  <span>${createdOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>You earned +{Math.round(createdOrder.total * 10)} Aura Loyalty Points!</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTrackingOrder(createdOrder);
                    setActiveView('dashboard');
                    setDashboardTab('shipments');
                  }}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span>Track Live Delivery in Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    setActiveView('store');
                  }}
                  className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
                >
                  Continue Browsing Atelier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
