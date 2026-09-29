import { Coupon } from '../types';

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export interface DeliverySlotOption {
  id: string;
  name: string;
  timeRange: string;
  icon: string;
  tag?: string;
  extraFee?: number;
}

export const DELIVERY_SLOTS: DeliverySlotOption[] = [
  {
    id: 'morning',
    name: 'Morning Delivery',
    timeRange: '9:00 AM – 12:00 PM',
    icon: '🌅',
    tag: 'Fresh Morning Surprise',
  },
  {
    id: 'afternoon',
    name: 'Afternoon Delivery',
    timeRange: '1:00 PM – 4:00 PM',
    icon: '☀️',
    tag: 'Standard Daytime',
  },
  {
    id: 'evening',
    name: 'Evening Delivery',
    timeRange: '5:00 PM – 8:00 PM',
    icon: '🌆',
    tag: 'Most Popular',
  },
  {
    id: 'midnight',
    name: 'Midnight Surprise Delivery',
    timeRange: '11:30 PM – 12:15 AM',
    icon: '🌙',
    tag: 'Birthday & Anniversary Special',
    extraFee: 99,
  },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'AURA10',
    title: '10% Handcrafted Discount',
    description: 'Enjoy 10% off your entire order of handmade bouquets and decor.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    tag: 'Trending',
  },
  {
    code: 'FIRSTGIFT',
    title: 'Flat ₹150 OFF Welcome Gift',
    description: 'Flat ₹150 discount for your first bespoke gift or ribbon bouquet.',
    discountType: 'flat',
    discountValue: 150,
    minOrderValue: 999,
    tag: 'New Customer',
  },
  {
    code: 'FESTIVE200',
    title: 'Flat ₹200 Festive Celebration',
    description: 'Save ₹200 on luxury chocolate hampers & multi-flower arrangements.',
    discountType: 'flat',
    discountValue: 200,
    minOrderValue: 1499,
    tag: 'Festive Special',
  },
  {
    code: 'FREESHIP',
    title: 'Free All-India Express Courier',
    description: 'Free expedited courier delivery across 24,000+ Indian pincodes.',
    discountType: 'free_shipping',
    discountValue: 99,
    minOrderValue: 699,
    tag: 'Free Shipping',
  },
];

// Helper to look up City & State from a 6-digit Indian PIN code prefix
export function lookupIndianPincode(pincode: string): {
  valid: boolean;
  city: string;
  state: string;
  deliveryDays: string;
  expressAvailable: boolean;
  hub: string;
} {
  const cleanPin = pincode.replace(/\D/g, '');
  if (cleanPin.length !== 6) {
    return {
      valid: false,
      city: '',
      state: '',
      deliveryDays: '',
      expressAvailable: false,
      hub: '',
    };
  }

  const prefix2 = cleanPin.slice(0, 2);
  const prefix3 = cleanPin.slice(0, 3);

  // Common metropolitan & state clusters
  if (prefix3 === '560' || prefix3 === '561' || prefix3 === '562') {
    return { valid: true, city: 'Bengaluru', state: 'Karnataka', deliveryDays: '1-2 Days (Same Day Available)', expressAvailable: true, hub: 'Bengaluru Central Hub' };
  }
  if (prefix3 === '400') {
    return { valid: true, city: 'Mumbai', state: 'Maharashtra', deliveryDays: '2 Days', expressAvailable: true, hub: 'Mumbai Metro Logistics' };
  }
  if (prefix3 === '411') {
    return { valid: true, city: 'Pune', state: 'Maharashtra', deliveryDays: '2 Days', expressAvailable: true, hub: 'Pune West Hub' };
  }
  if (prefix3 === '110') {
    return { valid: true, city: 'New Delhi', state: 'Delhi', deliveryDays: '2 Days', expressAvailable: true, hub: 'Delhi Okhla Hub' };
  }
  if (prefix3 === '600') {
    return { valid: true, city: 'Chennai', state: 'Tamil Nadu', deliveryDays: '2 Days', expressAvailable: true, hub: 'Chennai Guindy Hub' };
  }
  if (prefix3 === '500') {
    return { valid: true, city: 'Hyderabad', state: 'Telangana', deliveryDays: '2 Days', expressAvailable: true, hub: 'Hyderabad HITEC Hub' };
  }
  if (prefix3 === '700') {
    return { valid: true, city: 'Kolkata', state: 'West Bengal', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Kolkata Salt Lake Hub' };
  }
  if (prefix3 === '380') {
    return { valid: true, city: 'Ahmedabad', state: 'Gujarat', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Ahmedabad Hub' };
  }
  if (prefix3 === '302') {
    return { valid: true, city: 'Jaipur', state: 'Rajasthan', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Jaipur Central Hub' };
  }
  if (prefix3 === '682' || prefix3 === '695') {
    return { valid: true, city: 'Kochi / Trivandrum', state: 'Kerala', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Kerala Express Hub' };
  }

  // Zone by first 2 digits
  switch (prefix2) {
    case '11':
      return { valid: true, city: 'Delhi', state: 'Delhi', deliveryDays: '2 Days', expressAvailable: true, hub: 'Delhi NCR Hub' };
    case '12':
    case '13':
      return { valid: true, city: 'Gurugram / Faridabad', state: 'Haryana', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Haryana Hub' };
    case '14':
    case '15':
    case '16':
      return { valid: true, city: 'Chandigarh / Amritsar', state: 'Punjab', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Punjab Hub' };
    case '17':
      return { valid: true, city: 'Shimla / Solan', state: 'Himachal Pradesh', deliveryDays: '3-4 Days', expressAvailable: false, hub: 'Himachal Valley Hub' };
    case '18':
    case '19':
      return { valid: true, city: 'Jammu / Srinagar', state: 'Jammu and Kashmir', deliveryDays: '3-5 Days', expressAvailable: false, hub: 'J&K Courier Hub' };
    case '20':
    case '21':
    case '22':
    case '23':
    case '24':
    case '25':
    case '26':
    case '27':
    case '28':
      return { valid: true, city: 'Noida / Lucknow', state: 'Uttar Pradesh', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'UP Central Hub' };
    case '30':
    case '31':
    case '32':
    case '33':
    case '34':
      return { valid: true, city: 'Jaipur / Jodhpur', state: 'Rajasthan', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Rajasthan Hub' };
    case '36':
    case '37':
    case '38':
    case '39':
      return { valid: true, city: 'Ahmedabad / Surat', state: 'Gujarat', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Gujarat Hub' };
    case '40':
    case '41':
    case '42':
    case '43':
    case '44':
      return { valid: true, city: 'Mumbai / Pune / Nagpur', state: 'Maharashtra', deliveryDays: '2 Days', expressAvailable: true, hub: 'Maharashtra Hub' };
    case '45':
    case '46':
    case '47':
    case '48':
    case '49':
      return { valid: true, city: 'Bhopal / Indore', state: 'Madhya Pradesh', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'MP Hub' };
    case '50':
    case '51':
    case '52':
    case '53':
      return { valid: true, city: 'Hyderabad / Vijayawada', state: 'Andhra Pradesh & Telangana', deliveryDays: '2 Days', expressAvailable: true, hub: 'Deccan Hub' };
    case '56':
    case '57':
    case '58':
    case '59':
      return { valid: true, city: 'Bengaluru / Mysuru', state: 'Karnataka', deliveryDays: '1-2 Days', expressAvailable: true, hub: 'Karnataka Southern Hub' };
    case '60':
    case '61':
    case '62':
    case '63':
    case '64':
      return { valid: true, city: 'Chennai / Coimbatore', state: 'Tamil Nadu', deliveryDays: '2 Days', expressAvailable: true, hub: 'Tamil Nadu Hub' };
    case '67':
    case '68':
    case '69':
      return { valid: true, city: 'Kochi / Kozhikode', state: 'Kerala', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Kerala Hub' };
    case '70':
    case '71':
    case '72':
    case '73':
    case '74':
      return { valid: true, city: 'Kolkata / Howrah', state: 'West Bengal', deliveryDays: '2-3 Days', expressAvailable: true, hub: 'Eastern Hub' };
    case '75':
    case '76':
    case '77':
      return { valid: true, city: 'Bhubaneswar / Cuttack', state: 'Odisha', deliveryDays: '3 Days', expressAvailable: true, hub: 'Odisha Hub' };
    case '78':
    case '79':
      return { valid: true, city: 'Guwahati / North East', state: 'Assam & NE', deliveryDays: '3-5 Days', expressAvailable: false, hub: 'North East Express' };
    case '80':
    case '81':
    case '82':
    case '83':
    case '84':
    case '85':
      return { valid: true, city: 'Patna / Ranchi', state: 'Bihar & Jharkhand', deliveryDays: '3 Days', expressAvailable: true, hub: 'Bihar/Jharkhand Hub' };
    default:
      return { valid: true, city: 'National Delivery Area', state: 'India', deliveryDays: '3-4 Days', expressAvailable: true, hub: 'All-India Express Hub' };
  }
}
