export interface UserAddress {
  street: string;
  apartment?: string;
  flatNo?: string;
  areaStreet?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  pincode?: string;
  country: string;
  deliverySlot?: string;
  deliveryDate?: string;
  phone?: string;
  altPhone?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
  mfaEnabled: boolean;
  mfaMethod: 'sms' | 'authenticator';
  backupPhone?: string;
  loyaltyPoints: number;
  loyaltyTier: 'Silver Artisan' | 'Gold Connoisseur' | 'Velvet Platinum';
  memberSince: string;
  giftPreferences: {
    defaultGiftNote: string;
    ecoFriendlyWrap: boolean;
    includeWaxSeal: boolean;
    preferredRibbon: 'Emerald Velvet' | 'Champagne Gold' | 'Vintage Rose' | 'Lavender Satin' | 'Blush Pink Satin' | 'Golden Honey Satin';
  };
}

export type ProductCategory =
  | 'Pipe Cleaner Bouquets'
  | 'Chocolate Bouquets'
  | 'Satin Ribbon Bouquets'
  | 'Photo Frames & Keepsakes'
  | 'Polaroid Sets'
  | 'Accessory & Charm Bouquets'
  | 'Gift Hampers';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImages?: string[];
  dimensions: string;
  material: string;
  artisanOrigin: string;
  description: string;
  story: string;
  inStock: boolean;
  featured?: boolean;
  tags: string[];
  deliveryEstimateDays?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat' | 'free_shipping';
  discountValue: number;
  minOrderValue: number;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftWrapType: 'Signature Velvet Box' | 'Botanical Mulberry Paper' | 'Minimalist Linen' | 'Scalloped Floristry Paper';
  ribbonColor: 'Emerald Velvet' | 'Champagne Gold' | 'Vintage Rose' | 'Lavender Satin' | 'Blush Pink Satin' | 'Golden Honey Satin';
  waxSeal: boolean;
  giftCardMessage: string;
  recipientName: string;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Artisan Crafting & Gift Wrapping'
  | 'Dispatched from Atelier'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered';

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  items: CartItem[];
  shippingAddress: UserAddress;
  recipientName: string;
  carrier: 'Blue Dart Express (India)' | 'DTDC Premium' | 'Delhivery Express' | 'Artisan White Glove Delivery' | string;
  trackingNumber: string;
  estimatedDelivery: string;
  deliverySlot?: string;
  trackingEvents: TrackingEvent[];
  paymentMethod:
    | 'UPI (GPay / PhonePe / Paytm / BHIM)'
    | 'UPI QR Code (Scan & Pay)'
    | 'Cash on Delivery (COD)'
    | 'Net Banking (All Indian Banks)'
    | 'Credit / Debit Card (RuPay / Visa / MC)'
    | 'Credit Card (3D Secure)'
    | 'Apple Pay'
    | 'Google Pay'
    | 'Instant Bank / UPI'
    | string;
  upiId?: string;
  couponCode?: string;
  cardLastFour?: string;
  receiptUrl?: string;
}

export interface LoyaltyReward {
  id: string;
  code: string;
  title: string;
  discountDisplay: string;
  description: string;
  pointsCost: number;
  minSpend: number;
  expiresInDays: number;
  isUnlocked: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'shipment' | 'promo' | 'loyalty' | 'security';
  timestamp: string;
  read: boolean;
  orderId?: string;
  promoCode?: string;
}

export interface SecurityActivity {
  id: string;
  action: string;
  device: string;
  location: string;
  ip: string;
  timestamp: string;
  status: 'Authorized' | 'MFA Verified' | 'Security Alert';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'n8n' | 'gemini' | 'knowledge-base';
}

export interface N8nConfig {
  webhookUrl: string;
  enabled: boolean;
  sessionId: string;
  lastStatus?: 'connected' | 'inactive' | 'error' | 'untested';
  lastPingTime?: string;
  errorMessage?: string;
  widgetMode?: 'artisan' | 'n8n_native';
}

export interface KnowledgeEntry {
  id: string;
  category: 'Products & Craft' | 'Shipping & Delivery' | 'Returns & Guarantee' | 'Promotions & Discounts' | 'Custom Gifting & Cards' | 'Store Story & Atelier';
  title: string;
  keywords: string[];
  content: string;
  updatedAt: string;
  active: boolean;
}
