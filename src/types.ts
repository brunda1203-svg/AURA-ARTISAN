export interface UserAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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

export interface Product {
  id: string;
  name: string;
  category: 'Pipe Cleaner Bouquets' | 'Gift Hampers' | 'Birthday Cards & Keepsakes' | 'Keepsake Vessels' | 'Botanical & Glass' | 'Candles & Scents' | 'Brass & Metalcraft';
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
  carrier: 'FedEx Artisan Luxury Express' | 'DHL Heritage Freight' | 'White Glove Courier';
  trackingNumber: string;
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
  paymentMethod: 'Credit Card (3D Secure)' | 'Apple Pay' | 'Google Pay' | 'Instant Bank / UPI';
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
}
