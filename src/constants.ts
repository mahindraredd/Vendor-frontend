import { NavigationStep } from './types';

export const STEPS = {
  ORDERS: 1,
  ORDER_DETAILS: 2,
  SHIPPING_LABEL: 3,
  SHIPPING_PROGRESS: 4,
  ORDER_COMPLETE: 5
};

export const NAVIGATION_ITEMS: NavigationStep[] = [
  { id: STEPS.ORDERS, title: 'New', icon: 'Package' },
  { id: STEPS.ORDER_DETAILS, title: 'Active', icon: 'Truck' },
  { id: STEPS.ORDER_COMPLETE, title: 'Completed', icon: 'CheckCircle' }
];

export const MOCK_ORDERS = [
  {
    id: '2345',
    status: 'new',
    product: {
      name: 'Cotton T-shirt (Black)',
      size: 'M',
      quantity: 2,
      imageUrl: '/api/placeholder/64/64'
    },
    customer: {
      name: 'Rahul Singh',
      address: '123 Main Street, Sector 4',
      city: 'Delhi',
      postalCode: '110001',
      phone: '+91 98765 43210',
      location: 'Delhi'
    },
    total: 1200,
    tax: 200,
    shippingCost: 120,
    courier: 'Delhivery',
    trackingId: 'DL87654321IN'
  },
  {
    id: '2344',
    status: 'new',
    product: {
      name: 'Denim Jacket',
      size: 'L',
      quantity: 1,
      imageUrl: '/api/placeholder/64/64'
    },
    customer: {
      name: 'Priya M.',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      location: 'Mumbai'
    },
    total: 2450
  },
  {
    id: '2341',
    status: 'delivered',
    product: {
      name: 'Denim Jeans',
      size: '32',
      quantity: 1,
      imageUrl: '/api/placeholder/64/64'
    },
    customer: {
      name: 'Anil K.',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      location: 'Bangalore'
    },
    total: 1850,
    deliveredDate: 'Apr 10'
  },
  {
    id: '2342',
    status: 'in_transit',
    product: {
      name: 'Silk Scarf',
      color: 'Blue',
      quantity: 1,
      imageUrl: '/api/placeholder/64/64'
    },
    customer: {
      name: 'Maya P.',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      location: 'Chennai'
    },
    total: 950
  }
];
