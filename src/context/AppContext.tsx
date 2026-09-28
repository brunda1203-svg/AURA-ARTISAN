import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Product,
  CartItem,
  Order,
  OrderStatus,
  LoyaltyReward,
  NotificationItem,
  SecurityActivity,
  ChatMessage,
  KnowledgeEntry,
  N8nConfig,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REWARDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SECURITY_ACTIVITIES,
  INITIAL_KNOWLEDGE_BASE,
} from '../data/mockData';

interface AppContextType {
  // Authentication & MFA
  user: User | null;
  isAuthenticated: boolean;
  mfaPending: boolean;
  mfaExpectedCode: string;
  mfaMethodUsed: 'sms' | 'authenticator';
  login: (identifier: string, pass: string) => { success: boolean; requiresMfa?: boolean; message?: string };
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  logout: () => void;
  register: (name: string, username: string, email: string, pass: string, phone: string) => void;
  updateProfile: (updated: Partial<User>) => void;
  toggleMfa: (enabled: boolean, method: 'sms' | 'authenticator') => void;
  updatePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  demoLogin: () => void;

  // Products
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    giftOptions?: {
      giftWrapType?: 'Signature Velvet Box' | 'Botanical Mulberry Paper' | 'Minimalist Linen' | 'Scalloped Floristry Paper';
      ribbonColor?: 'Emerald Velvet' | 'Champagne Gold' | 'Vintage Rose' | 'Lavender Satin' | 'Blush Pink Satin' | 'Golden Honey Satin';
      waxSeal?: boolean;
      giftCardMessage?: string;
      recipientName?: string;
    }
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;

  // Orders & Real-time Tracking
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  advanceTrackingSimulation: (orderId: string) => void;
  placeOrder: (details: {
    recipientName: string;
    shippingAddress: User['shippingAddress'];
    paymentMethod: 'Credit Card (3D Secure)' | 'Apple Pay' | 'Google Pay' | 'Instant Bank / UPI';
    cardNumber?: string;
  }) => Order;

  // Loyalty & Rewards
  loyaltyRewards: LoyaltyReward[];
  activeCoupon: LoyaltyReward | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  redeemReward: (rewardId: string) => { success: boolean; message: string };

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendPushNotification: (
    title: string,
    message: string,
    type: 'shipment' | 'promo' | 'loyalty' | 'security',
    extra?: { orderId?: string; promoCode?: string }
  ) => void;
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<void>;
  pushSettings: { shipments: boolean; promotions: boolean; security: boolean };
  updatePushSettings: (newSettings: Partial<{ shipments: boolean; promotions: boolean; security: boolean }>) => void;

  // AI Chatbot & Knowledge Base Training
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  knowledgeBase: KnowledgeEntry[];
  isTrainingModalOpen: boolean;
  setIsTrainingModalOpen: (open: boolean) => void;
  addKnowledgeEntry: (entry: Omit<KnowledgeEntry, 'id' | 'updatedAt'>) => void;
  updateKnowledgeEntry: (id: string, updated: Partial<KnowledgeEntry>) => void;
  deleteKnowledgeEntry: (id: string) => void;
  resetKnowledgeBase: () => void;
  importWebsiteTrainingData: (rawText: string, title?: string, category?: KnowledgeEntry['category']) => void;
  n8nConfig: N8nConfig;
  updateN8nConfig: (newConfig: Partial<N8nConfig>) => void;
  testN8nConnection: (url?: string) => Promise<{ status: string; message: string; hint?: string }>;

  // Security Logs
  securityLogs: SecurityActivity[];

  // Navigation View
  activeView: 'store' | 'dashboard' | 'tracking' | 'rewards';
  setActiveView: (view: 'store' | 'dashboard' | 'tracking' | 'rewards') => void;
  dashboardTab: 'overview' | 'shipments' | 'orders' | 'rewards' | 'profile' | 'security' | 'notifications' | 'ai-training';
  setDashboardTab: (tab: 'overview' | 'shipments' | 'orders' | 'rewards' | 'profile' | 'security' | 'notifications' | 'ai-training') => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Authentication State
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [mfaPending, setMfaPending] = useState<boolean>(false);
  const [mfaExpectedCode, setMfaExpectedCode] = useState<string>('482910');
  const [mfaMethodUsed, setMfaMethodUsed] = useState<'sms' | 'authenticator'>('sms');
  const [pendingUserCandidate, setPendingUserCandidate] = useState<User | null>(null);

  // Security Activities Log
  const [securityLogs, setSecurityLogs] = useState<SecurityActivity[]>(INITIAL_SECURITY_ACTIVITIES);

  // Navigation & Views
  const [activeView, setActiveView] = useState<'store' | 'dashboard' | 'tracking' | 'rewards'>('store');
  const [dashboardTab, setDashboardTab] = useState<
    'overview' | 'shipments' | 'orders' | 'rewards' | 'profile' | 'security' | 'notifications' | 'ai-training'
  >('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Catalog & Search
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      giftWrapType: 'Signature Velvet Box',
      ribbonColor: 'Emerald Velvet',
      waxSeal: true,
      giftCardMessage: 'To new beginnings and warm hearths. With all my love.',
      recipientName: 'Brunda M.',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Orders & Shipments
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(INITIAL_ORDERS[0]);

  // Loyalty & Rewards
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(INITIAL_REWARDS);
  const [activeCoupon, setActiveCoupon] = useState<LoyaltyReward | null>(INITIAL_REWARDS[0]); // GIFT15 active

  // Notifications & Push
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [pushSettings, setPushSettings] = useState({
    shipments: true,
    promotions: true,
    security: true,
  });

  // AI Chatbot & Knowledge Base Training
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState<boolean>(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aura_trained_knowledge');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load trained knowledge from storage:', e);
      }
    }
    return INITIAL_KNOWLEDGE_BASE;
  });

  // Sync knowledge base to storage and server whenever changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aura_trained_knowledge', JSON.stringify(knowledgeBase));
      } catch (e) {
        console.warn('Failed to save trained knowledge to storage:', e);
      }
    }
    // Sync with backend API
    fetch('/api/knowledge/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: knowledgeBase }),
    }).catch(() => {});
  }, [knowledgeBase]);

  const addKnowledgeEntry = (entry: Omit<KnowledgeEntry, 'id' | 'updatedAt'>) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: `kb_${Date.now()}`,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setKnowledgeBase((prev) => [newEntry, ...prev]);
  };

  const updateKnowledgeEntry = (id: string, updated: Partial<KnowledgeEntry>) => {
    setKnowledgeBase((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updated,
              updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            }
          : item
      )
    );
  };

  const deleteKnowledgeEntry = (id: string) => {
    setKnowledgeBase((prev) => prev.filter((item) => item.id !== id));
  };

  const resetKnowledgeBase = () => {
    setKnowledgeBase(INITIAL_KNOWLEDGE_BASE);
  };

  const importWebsiteTrainingData = (rawText: string, title?: string, category: KnowledgeEntry['category'] = 'Products & Craft') => {
    if (!rawText.trim()) return;
    const cleanTitle = title || `Custom Website Info - ${new Date().toLocaleDateString()}`;
    const words = rawText
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(' ')
      .filter((w) => w.length > 3)
      .slice(0, 10);
    const keywords = Array.from(new Set(words));
    addKnowledgeEntry({
      title: cleanTitle,
      category,
      keywords,
      content: rawText.trim(),
      active: true,
    });
  };

  // n8n Webhook Chat Configuration
  const [n8nConfig, setN8nConfig] = useState<N8nConfig>(() => {
    const defaultUrl = 'https://brunda12.app.n8n.cloud/webhook/84980e58-6360-483c-8653-ebe138d55463/chat';
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aura_n8n_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load n8n config from storage:', e);
      }
    }
    return {
      webhookUrl: defaultUrl,
      enabled: true,
      sessionId: `aura_session_${Math.random().toString(36).substring(2, 9)}`,
      lastStatus: 'untested',
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aura_n8n_config', JSON.stringify(n8nConfig));
      } catch (e) {
        console.warn('Failed to save n8n config:', e);
      }
    }
  }, [n8nConfig]);

  const updateN8nConfig = (newConfig: Partial<N8nConfig>) => {
    setN8nConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const testN8nConnection = async (url?: string) => {
    const targetUrl = url || n8nConfig.webhookUrl;
    try {
      const res = await fetch('/api/n8n/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: targetUrl }),
      });
      const data = await res.json();
      const status = data.status === 'active' ? 'connected' : data.status === 'inactive' ? 'inactive' : 'error';
      updateN8nConfig({
        lastStatus: status,
        lastPingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        errorMessage: data.hint || data.message || undefined,
      });
      return {
        status: data.status,
        message: data.message,
        hint: data.hint,
      };
    } catch (err: any) {
      updateN8nConfig({
        lastStatus: 'error',
        lastPingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        errorMessage: err?.message || 'Connection failed',
      });
      return {
        status: 'error',
        message: 'Could not contact n8n server',
      };
    }
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Greetings! I am Aura, your artisan gifting advisor. I am trained on our complete website data, handcrafted pipe cleaner bouquets, satin ribbons, and live shipment tracking. How may I assist you today?',
      timestamp: 'Just now',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Synchronize browser notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  // Dispatch Push Notification (Browser Native + In-App)
  const sendPushNotification = (
    title: string,
    message: string,
    type: 'shipment' | 'promo' | 'loyalty' | 'security',
    extra?: { orderId?: string; promoCode?: string }
  ) => {
    // Check channel toggle
    if (type === 'shipment' && !pushSettings.shipments) return;
    if (type === 'promo' && !pushSettings.promotions) return;
    if (type === 'security' && !pushSettings.security) return;

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      orderId: extra?.orderId,
      promoCode: extra?.promoCode,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Native browser push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Native notification trigger:', err);
      }
    }
  };

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          sendPushNotification(
            'Push Notifications Activated!',
            'You will now receive live status alerts when your handcrafted gift ships and out for delivery.',
            'shipment'
          );
        }
      } catch (err) {
        console.warn('Error requesting notification permission:', err);
      }
    }
  };

  const updatePushSettings = (newSettings: Partial<{ shipments: boolean; promotions: boolean; security: boolean }>) => {
    setPushSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartDiscount = activeCoupon
    ? activeCoupon.code === 'GIFT15'
      ? Math.round(cartSubtotal * 0.15 * 100) / 100
      : activeCoupon.code === 'HANDCRAFT25' && cartSubtotal >= 120
      ? 25
      : 0
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Cart actions
  const addToCart = (
    product: Product,
    quantity = 1,
    giftOptions?: {
      giftWrapType?: 'Signature Velvet Box' | 'Botanical Mulberry Paper' | 'Minimalist Linen' | 'Scalloped Floristry Paper';
      ribbonColor?: 'Emerald Velvet' | 'Champagne Gold' | 'Vintage Rose' | 'Lavender Satin' | 'Blush Pink Satin' | 'Golden Honey Satin';
      waxSeal?: boolean;
      giftCardMessage?: string;
      recipientName?: string;
    }
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const newItem: CartItem = {
        product,
        quantity,
        giftWrapType: giftOptions?.giftWrapType || 'Signature Velvet Box',
        ribbonColor: giftOptions?.ribbonColor || (user?.giftPreferences.preferredRibbon ?? 'Emerald Velvet'),
        waxSeal: giftOptions?.waxSeal ?? (user?.giftPreferences.includeWaxSeal ?? true),
        giftCardMessage: giftOptions?.giftCardMessage || (user?.giftPreferences.defaultGiftNote ?? ''),
        recipientName: giftOptions?.recipientName || (user?.fullName ?? 'Valued Recipient'),
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => setCart([]);

  // Authentication Flow
  const login = (identifier: string, pass: string) => {
    const trimmed = identifier.trim().toLowerCase();
    // Validate if it matches current user or demo credentials
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Please enter a valid password (minimum 4 characters).' };
    }

    const matchedUser =
      (user && (user.username.toLowerCase() === trimmed || user.email.toLowerCase() === trimmed))
        ? user
        : INITIAL_USER;

    if (matchedUser.mfaEnabled) {
      // 2FA Challenge triggered
      const generatedCode = '482910'; // Deterministic simulation code shown to user
      setMfaExpectedCode(generatedCode);
      setMfaMethodUsed(matchedUser.mfaMethod);
      setMfaPending(true);
      setPendingUserCandidate(matchedUser);

      // Trigger prompt / push notification
      sendPushNotification(
        '2FA Verification Code: 482910',
        `Your Aura Artisan security authentication code is 482910. Never share this code.`,
        'security'
      );

      return { success: true, requiresMfa: true };
    }

    // Direct login if MFA disabled
    setUser(matchedUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    // Add security log
    addSecurityLog('Direct Login (Password Verified)', 'Authorized');

    sendPushNotification(
      'Welcome Back to Aura Artisan',
      `Signed in successfully as ${matchedUser.fullName}.`,
      'security'
    );

    return { success: true };
  };

  const verifyMfa = (code: string): boolean => {
    if (code.trim() === mfaExpectedCode || code.trim() === '123456') {
      const activeUser = pendingUserCandidate || user || INITIAL_USER;
      setUser(activeUser);
      setIsAuthenticated(true);
      setMfaPending(false);
      setPendingUserCandidate(null);
      setIsAuthModalOpen(false);

      addSecurityLog('Login Multi-Factor Authenticated (2FA Passed)', 'MFA Verified');

      sendPushNotification(
        'Account Protected: 2FA Passed',
        `Successful multi-factor authentication from ${activeUser.shippingAddress.city}, ${activeUser.shippingAddress.state}.`,
        'security'
      );
      return true;
    }
    return false;
  };

  const cancelMfa = () => {
    setMfaPending(false);
    setPendingUserCandidate(null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    addSecurityLog('User Logged Out', 'Authorized');
    sendPushNotification('Session Terminated', 'You have been securely signed out.', 'security');
  };

  const demoLogin = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setMfaPending(false);
    addSecurityLog('Quick Demo Login Verified', 'Authorized');
  };

  const register = (name: string, username: string, email: string, _pass: string, phone: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: username || 'artisan_patron',
      email: email || 'patron@example.com',
      fullName: name || 'Artisan Guest',
      phone: phone || '+1 (555) 234-5678',
      shippingAddress: {
        street: '100 Heritage Blossom Lane',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
      },
      billingAddress: {
        street: '100 Heritage Blossom Lane',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
      },
      mfaEnabled: true,
      mfaMethod: 'sms',
      loyaltyPoints: 100, // 100 bonus welcome points
      loyaltyTier: 'Silver Artisan',
      memberSince: 'September 2026',
      giftPreferences: {
        defaultGiftNote: 'A token of warmth and celebration.',
        ecoFriendlyWrap: true,
        includeWaxSeal: true,
        preferredRibbon: 'Emerald Velvet',
      },
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    addSecurityLog('Account Registered with 2FA Enabled', 'Authorized');

    sendPushNotification(
      'Welcome to Aura Rewards Club!',
      'You earned 100 welcome reward points on account creation. Multi-Factor security is active.',
      'loyalty'
    );
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    addSecurityLog('Contact Profile & Address Updated', 'Authorized');
    sendPushNotification(
      'Profile Updated Securely',
      'Your contact details and shipping preferences have been updated.',
      'security'
    );
  };

  const toggleMfa = (enabled: boolean, method: 'sms' | 'authenticator') => {
    if (!user) return;
    setUser({ ...user, mfaEnabled: enabled, mfaMethod: method });
    addSecurityLog(
      enabled ? `MFA Enabled (${method.toUpperCase()})` : 'MFA Disabled',
      enabled ? 'MFA Verified' : 'Security Alert'
    );
    sendPushNotification(
      enabled ? 'Two-Factor Protection Activated' : 'Security Alert: MFA Disabled',
      enabled
        ? `Your account is now protected with ${method === 'sms' ? 'SMS One-Time Passcodes' : 'Authenticator App'}.`
        : 'Two-factor authentication has been disabled for your account.',
      'security'
    );
  };

  const updatePassword = (_oldPass: string, _newPass: string) => {
    addSecurityLog('Password Successfully Changed', 'Authorized');
    sendPushNotification(
      'Password Changed',
      'Your account password has been updated securely. All other active sessions verified.',
      'security'
    );
    return { success: true, message: 'Password updated successfully.' };
  };

  const addSecurityLog = (action: string, status: 'Authorized' | 'MFA Verified' | 'Security Alert') => {
    const newLog: SecurityActivity = {
      id: `sec_${Date.now()}`,
      action,
      device: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] + ' / Web' : 'Browser Session',
      location: 'San Francisco, CA, USA',
      ip: '192.168.1.104',
      timestamp: 'Just now',
      status,
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  // Coupons & Loyalty
  const applyCoupon = (code: string) => {
    const found = loyaltyRewards.find((r) => r.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Coupon code not found or expired.' };
    }
    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum spend of $${found.minSpend}. (Current: $${cartSubtotal})`,
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied: ${found.discountDisplay}!` };
  };

  const removeCoupon = () => setActiveCoupon(null);

  const redeemReward = (rewardId: string) => {
    if (!user) return { success: false, message: 'Please log in to redeem points.' };
    const reward = loyaltyRewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found.' };

    if (user.loyaltyPoints < reward.pointsCost) {
      return {
        success: false,
        message: `Insufficient points. You need ${reward.pointsCost} points, but have ${user.loyaltyPoints}.`,
      };
    }

    const updatedPoints = user.loyaltyPoints - reward.pointsCost;
    setUser({ ...user, loyaltyPoints: updatedPoints });
    setLoyaltyRewards((prev) => prev.map((r) => (r.id === rewardId ? { ...r, isUnlocked: true } : r)));

    sendPushNotification(
      'Reward Voucher Unlocked!',
      `You redeemed ${reward.pointsCost} points for ${reward.title} (Code: ${reward.code}).`,
      'loyalty',
      { promoCode: reward.code }
    );

    return { success: true, message: `Successfully redeemed! Use code ${reward.code} at checkout.` };
  };

  // Real-Time Shipment Simulation
  const advanceTrackingSimulation = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const stages: OrderStatus[] = [
          'Order Placed',
          'Artisan Crafting & Gift Wrapping',
          'Dispatched from Atelier',
          'In Transit',
          'Out for Delivery',
          'Delivered',
        ];

        const currentIndex = stages.indexOf(ord.status);
        if (currentIndex >= stages.length - 1) {
          return ord; // Already delivered
        }

        const nextStatus = stages[currentIndex + 1];
        const updatedEvents = ord.trackingEvents.map((evt) => {
          if (evt.status === nextStatus) {
            return {
              ...evt,
              completed: true,
              current: true,
              timestamp: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
            };
          }
          return { ...evt, current: false };
        });

        // Trigger real push notification for shipment milestone
        sendPushNotification(
          `Shipment Update: ${nextStatus}`,
          `Order #${ord.orderNumber} is now: ${nextStatus}. Carrier: ${ord.carrier}.`,
          'shipment',
          { orderId: ord.id }
        );

        const updatedOrder: Order = {
          ...ord,
          status: nextStatus,
          trackingEvents: updatedEvents,
        };

        if (activeTrackingOrder?.id === orderId) {
          setActiveTrackingOrder(updatedOrder);
        }

        return updatedOrder;
      })
    );
  };

  // Checkout & Place Order
  const placeOrder = (details: {
    recipientName: string;
    shippingAddress: User['shippingAddress'];
    paymentMethod: 'Credit Card (3D Secure)' | 'Apple Pay' | 'Google Pay' | 'Instant Bank / UPI';
    cardNumber?: string;
  }): Order => {
    const orderNum = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
    const pointsEarned = Math.round(cartTotal * 10);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Order Placed',
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingCost: 0,
      total: cartTotal,
      items: [...cart],
      shippingAddress: details.shippingAddress,
      recipientName: details.recipientName,
      carrier: 'FedEx Artisan Luxury Express',
      trackingNumber: `7948-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-FX`,
      estimatedDelivery: 'In 2-3 business days',
      paymentMethod: details.paymentMethod,
      cardLastFour: details.cardNumber ? details.cardNumber.slice(-4) : '4242',
      trackingEvents: [
        {
          id: `evt_init_1`,
          status: 'Order Placed',
          location: 'Aura Artisan Atelier, San Francisco',
          timestamp: 'Just now',
          description: 'Payment authorized via 3D Secure gateway. Handcrafting queued.',
          completed: true,
          current: true,
        },
        {
          id: `evt_init_2`,
          status: 'Artisan Crafting & Gift Wrapping',
          location: 'Master Atelier Studio',
          timestamp: 'Scheduled today',
          description: 'Custom velvet box preparation & wax-sealed calligraphy card.',
          completed: false,
          current: false,
        },
        {
          id: `evt_init_3`,
          status: 'Dispatched from Atelier',
          location: 'San Francisco Express Hub',
          timestamp: 'Scheduled tomorrow morning',
          description: 'Carrier pickup with insured temperature-controlled transit.',
          completed: false,
          current: false,
        },
        {
          id: `evt_init_4`,
          status: 'In Transit',
          location: 'Regional Logistics Center',
          timestamp: 'Pending dispatch',
          description: 'Transit vehicle scan.',
          completed: false,
          current: false,
        },
        {
          id: `evt_init_5`,
          status: 'Out for Delivery',
          location: 'Local Delivery Station',
          timestamp: 'Pending transit',
          description: 'Courier route assigned.',
          completed: false,
          current: false,
        },
        {
          id: `evt_init_6`,
          status: 'Delivered',
          location: `${details.shippingAddress.street}, ${details.shippingAddress.city}`,
          timestamp: 'Pending delivery',
          description: 'Signature on arrival.',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    clearCart();

    // Reward points
    if (user) {
      setUser({
        ...user,
        loyaltyPoints: user.loyaltyPoints + pointsEarned,
      });
    }

    // Push notification for order confirmation
    sendPushNotification(
      `Order Confirmed #${orderNum}`,
      `Thank you for your order! Your handcrafted gift has been queued for artisan packaging. You earned +${pointsEarned} loyalty points!`,
      'shipment',
      { orderId: newOrder.id }
    );

    return newOrder;
  };

  // AI Chatbot Server communication
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          customKnowledge: knowledgeBase,
          useN8n: n8nConfig.enabled,
          n8nWebhookUrl: n8nConfig.webhookUrl,
          sessionId: n8nConfig.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();

      if (data.source === 'n8n') {
        updateN8nConfig({ lastStatus: 'connected', lastPingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      } else if (data.n8nStatus === 'inactive') {
        updateN8nConfig({ lastStatus: 'inactive', errorMessage: data.n8nHint || 'Workflow is inactive in n8n' });
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am delighted to help with your gifting selections.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || (n8nConfig.enabled ? 'n8n' : 'gemini'),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chat request failed, using intelligent client fallback:', err);
      // Check trained knowledge base first
      const lower = text.toLowerCase();
      let matchedContent: string | null = null;

      for (const entry of knowledgeBase.filter((k) => k.active)) {
        if (entry.title && lower.includes(entry.title.toLowerCase())) {
          matchedContent = entry.content;
          break;
        }
        if (entry.keywords && entry.keywords.some((kw) => kw && lower.includes(kw.toLowerCase()))) {
          matchedContent = entry.content;
          break;
        }
      }

      let fallback = matchedContent || "I'm here to assist with any questions about our decorative gifts, shipment tracking (#AG-94812), loyalty points, or gift packaging!";
      if (!matchedContent) {
        if (lower.includes('track') || lower.includes('order')) {
          fallback = "You can track your real-time shipment status under the 'Live Shipments' tab in your Dashboard. Order #AG-94812 is currently in transit with FedEx Artisan Express!";
        } else if (lower.includes('wrap') || lower.includes('box')) {
          fallback = "Each gift item is cradled in our signature velvet keepsake box, wrapped in handmade mulberry paper, and tied with your choice of emerald or champagne velvet ribbon.";
        } else if (lower.includes('discount') || lower.includes('code')) {
          fallback = "Use promo code 'GIFT15' for 15% off at checkout, or check your Loyalty Rewards tab to redeem points for $25 and $50 atelier credits!";
        }
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        mfaPending,
        mfaExpectedCode,
        mfaMethodUsed,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        register,
        updateProfile,
        toggleMfa,
        updatePassword,
        demoLogin,

        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,

        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,

        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        advanceTrackingSimulation,
        placeOrder,

        loyaltyRewards,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        redeemReward,

        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        sendPushNotification,
        pushPermission,
        requestPushPermission,
        pushSettings,
        updatePushSettings,

        isChatOpen,
        setIsChatOpen,
        chatMessages,
        isChatLoading,
        sendChatMessage,
        knowledgeBase,
        isTrainingModalOpen,
        setIsTrainingModalOpen,
        addKnowledgeEntry,
        updateKnowledgeEntry,
        deleteKnowledgeEntry,
        resetKnowledgeBase,
        importWebsiteTrainingData,
        n8nConfig,
        updateN8nConfig,
        testN8nConnection,

        securityLogs,

        activeView,
        setActiveView,
        dashboardTab,
        setDashboardTab,

        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
