// mockData.ts - Sample data for development

import { Order, OrderAddress } from './types';

// Mock vendor address
export const vendorAddress: OrderAddress = {
  name: "ShopInStreet Vendor Shop",
  street: "Shop #5, Main Market",
  city: "New Delhi",
  state: "Delhi",
  postalCode: "110001",
  country: "India",
  phone: "+91 98765 12345"
};

// Mock orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2345',
    status: 'pending',
    products: [
      { id: 1, name: 'Cotton T-shirt (Black)', quantity: 2, price: 600, imageUrl: '/api/placeholder/50/50' },
    ],
    customer: {
      name: 'Rahul Singh',
      street: '123 Main Street, Sector 4',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
      phone: '+91 98765 43210'
    },
    total: 1200,
    tax: 200,
    shippingCost: 120,
    createdAt: '2025-04-15T10:30:00',
  },
  {
    id: 'ORD-2344',
    status: 'processing',
    products: [
      { id: 2, name: 'Denim Jacket', quantity: 1, price: 2450, imageUrl: '/api/placeholder/50/50' },
    ],
    customer: {
      name: 'Priya Mehta',
      street: '45 Park Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      phone: '+91 87654 32109'
    },
    total: 2450,
    tax: 350,
    shippingCost: 150,
    createdAt: '2025-04-14T09:15:00',
  },
  {
    id: 'ORD-2343',
    status: 'shipped',
    products: [
      { id: 3, name: 'Leather Wallet', quantity: 1, price: 950, imageUrl: '/api/placeholder/50/50' },
    ],
    customer: {
      name: 'Amit Kumar',
      street: '78 Green Park, Phase 2',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600028',
      country: 'India',
      phone: '+91 76543 21098'
    },
    total: 950,
    tax: 150,
    shippingCost: 100,
    trackingId: 'TRK-87654321',
    createdAt: '2025-04-13T14:22:00',
    labelGenerated: true
  },
  {
    id: 'ORD-2342',
    status: 'delivered',
    products: [
      { id: 4, name: 'Silk Scarf', quantity: 1, price: 1850, imageUrl: '/api/placeholder/50/50' },
    ],
    customer: {
      name: 'Maya Patel',
      street: '34 Lake View Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      phone: '+91 65432 10987'
    },
    total: 1850,
    tax: 250,
    shippingCost: 130,
    trackingId: 'TRK-76543210',
    createdAt: '2025-04-10T11:45:00',
    labelGenerated: true
  }
];