import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from './IProductTypes';

interface ProductDetailProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onEdit, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit} 
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <img 
        src={product.image_url} 
        alt={product.name} 
        className="w-full h-48 object-contain rounded-lg bg-gray-50"
      />
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-medium">{product.category}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Available Stock</p>
          <p className="font-medium">{product.available_quantity}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Product ID</p>
          <p className="font-medium">{product.id}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Created</p>
          <p className="font-medium">{formatDate(product.created_at)}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{product.description}</p>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Pricing Tiers</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity (MOQ)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {product.pricing_tiers.map(tier => (
                <tr key={tier.id}>
                  <td className="px-4 py-2">{tier.moq}+</td>
                  <td className="px-4 py-2">${tier.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;