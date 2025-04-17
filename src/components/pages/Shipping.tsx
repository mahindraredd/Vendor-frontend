import React, { useState } from 'react';
import { 
  ArrowLeft,
  Camera, 
  Package, 
  Search,
  Truck,
  ChevronDown,
  Image,
  X
} from 'lucide-react';

const NewOrderScreen = () => {
  const [selectedProducts, setSelectedProducts] = useState([
    { id: 'p001', name: 'Blue T-shirt', variant: 'XL', price: 29.99, quantity: 1, image: '/api/placeholder/60/60' }
  ]);
  
  // For demonstration purposes - shipping options
  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, eta: '3-5 days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, eta: '1-2 days' },
    { id: 'economy', name: 'Economy Shipping', price: 3.99, eta: '5-7 days' },
  ];
  
  const [selectedShipping, setSelectedShipping] = useState('standard');
  
interface Product {
    id: string;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
}

const handleRemoveProduct = (productId: string): void => {
    setSelectedProducts(selectedProducts.filter((p: Product) => p.id !== productId));
};
  
const handleQuantityChange = (productId: string, newQuantity: number): void => {
    if (newQuantity < 1) return;
    
    setSelectedProducts(selectedProducts.map((p: Product) => 
        p.id === productId ? {...p, quantity: newQuantity} : p
    ));
};
  
  // Calculate order summary
  const subtotal = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const shipping = shippingOptions.find(option => option.id === selectedShipping)?.price || 0;
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + shipping + tax;
  
  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="border-b border-gray-200 p-4 flex items-center">
          <button className="flex items-center text-blue-500 font-medium">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold mx-auto">Create New Order</h1>
          <div className="w-20"></div> {/* For balance */}
        </div>
        
        {/* Order Form */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-bold mb-4">Customer Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input 
                    type="tel" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Street Address
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="123 Main St"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Apt #4B"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      City
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="New York"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      State/Province
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      {/* Other states would be here */}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      ZIP/Postal Code
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="10001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Country
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    {/* Other countries would be here */}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Product Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Products</h2>
                
                <button className="bg-blue-500 text-white rounded-full py-2 px-4 flex items-center">
                  <Package size={16} className="mr-2" />
                  Add Product
                </button>
              </div>
              
              {/* Product Search Bar */}
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Search for products..." 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              
              {/* Selected Products */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4">Product</th>
                      <th className="text-center p-4">Price</th>
                      <th className="text-center p-4">Quantity</th>
                      <th className="text-right p-4">Total</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map(product => (
                      <tr key={product.id} className="border-t border-gray-200">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-12 h-12 mr-4 rounded object-cover" 
                            />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-500">Variant: {product.variant}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">${product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button 
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                              onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="mx-3">{product.quantity}</span>
                            <button 
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                              onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <X size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Shipping Options */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-bold mb-4">Shipping Method</h2>
              
              <div className="space-y-3">
                {shippingOptions.map(option => (
                  <div 
                    key={option.id}
                    className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                      selectedShipping === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedShipping(option.id)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedShipping === option.id ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedShipping === option.id && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-sm text-gray-500">Estimated delivery: {option.eta}</p>
                    </div>
                    
                    <div className="font-medium">${option.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Summary Sidebar */}
      <div className="w-1/4 border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          <p className="text-gray-500">Review and place order</p>
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            
            <div className="h-px bg-gray-200 my-4"></div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Payment Method</h3>
            
            <div className="border rounded-lg p-4 flex items-center">
              <div className="w-10 h-6 bg-blue-500 rounded mr-3"></div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
              <ChevronDown size={20} className="ml-auto text-gray-400" />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Notes</h3>
            
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg h-24 resize-none focus:outline-none focus:border-blue-500"
              placeholder="Add any special instructions or notes for this order..."
            ></textarea>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg mb-3">
            Place Order
          </button>
          
          <button className="w-full text-gray-600 py-2 rounded-lg text-center">
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderScreen;