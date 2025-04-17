import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  Truck, 
  Bell, 
  Mail, 
  User, 
  Search, 
  MoreHorizontal,
  Plus,
  MessageCircle,
  ShoppingBag
} from 'lucide-react';

const OrderDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Sample order data
  const orders = [
    { id: '1001', customer: 'John Smith', product: 'Blue T-shirt XL', status: 'New', date: 'Apr 12', amount: '$29.99' },
    { id: '1002', customer: 'Sarah Lee', product: 'Wireless Headphones', status: 'Processing', date: 'Apr 11', amount: '$79.99' },
    { id: '1003', customer: 'Mike Johnson', product: 'Smartphone Case', status: 'Shipped', date: 'Apr 10', amount: '$15.50' },
    { id: '1004', customer: 'Emma Garcia', product: 'Water Bottle 32oz', status: 'Delivered', date: 'Apr 9', amount: '$24.99' },
    { id: '1005', customer: 'Robert Chen', product: 'Desk Lamp', status: 'New', date: 'Apr 12', amount: '$45.00' },
  ];

  // Status color mapping (Twitter-like color scheme)
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-500';
      case 'Processing': return 'bg-yellow-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Left Sidebar */}
      <div style={{width: '20%'}} className="w-1/6 border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-500">ShipEasy</h1>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li 
              className={`flex items-center p-3 rounded-full font-medium ${activeTab === 'home' ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('home')}
            >
              <Home className="mr-4" size={24} />
              <span>Dashboard</span>
            </li>
            <li 
              className={`flex items-center p-3 rounded-full font-medium ${activeTab === 'orders' ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package className="mr-4" size={24} />
              <span>Orders</span>
            </li>
            <li 
              className={`flex items-center p-3 rounded-full font-medium ${activeTab === 'shipping' ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('shipping')}
            >
              <Truck className="mr-4" size={24} />
              <span>Shipping</span>
            </li>
            <li 
              className={`flex items-center p-3 rounded-full font-medium ${activeTab === 'messages' ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageCircle className="mr-4" size={24} />
              <span>Messages</span>
            </li>
            <li 
              className={`flex items-center p-3 rounded-full font-medium ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="mr-4" size={24} />
              <span>Notifications</span>
            </li>
            <li 
              className={`flex items-center p-3 rounded-full font-medium ${activeTab === 'profile' ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="mr-4" size={24} />
              <span>Profile</span>
            </li>
          </ul>
        </nav>
        
        <div className="mt-6">
          <button className="bg-blue-500 text-white rounded-full py-3 px-6 w-full font-bold flex items-center justify-center">
            <Plus size={20} className="mr-2" />
            New Order
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="relative w-1/3">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <Bell size={24} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </div>
            <div className="relative mr-4">
              <Mail size={24} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-gray-700 font-bold">
                VS
              </div>
              <span className="font-medium">Vendor Shop</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            
            {/* Order Cards */}
            <div className="grid grid-cols-1 gap-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <ShoppingBag size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-500">Order #{order.id}</span>
                      </div>
                      <h3 className="font-bold text-lg">{order.product}</h3>
                      <p className="text-gray-700">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <span className={`${getStatusColor(order.status)} text-white text-sm py-1 px-3 rounded-full`}>
                        {order.status}
                      </span>
                      <p className="mt-2 text-gray-500 text-sm">{order.date}</p>
                      <p className="font-bold">{order.amount}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button className="text-blue-500 font-medium text-sm hover:text-blue-700">
                      View Details
                    </button>
                    <div className="flex space-x-2">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm">
                        Message
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm">
                        Process
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-4">
            <button className="text-blue-500 font-medium hover:text-blue-700">
              View All Orders
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Quick Actions */}
      <div style={{width: '30%'}} className="w-1/5 border-l border-gray-200 p-4">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        
        <div className="space-y-4">
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg flex items-center">
            <Package className="mr-3 text-blue-500" size={20} />
            <span>Create Shipping Label</span>
          </button>
          
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg flex items-center">
            <Truck className="mr-3 text-blue-500" size={20} />
            <span>Schedule Pickup</span>
          </button>
          
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg flex items-center">
            <MessageCircle className="mr-3 text-blue-500" size={20} />
            <span>Message Customer</span>
          </button>
        </div>
        
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Today's Summary</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">New Orders</p>
              <p className="text-xl font-bold text-blue-500">12</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <p className="text-sm text-gray-600">To Ship</p>
              <p className="text-xl font-bold text-purple-500">8</p>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-bold text-yellow-500">5</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-green-500">7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;