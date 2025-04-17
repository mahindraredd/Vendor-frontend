import React, { useState, useEffect } from 'react';
import { PricingTier, Product } from './IProductTypes';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  isAdding: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, isAdding }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('/api/placeholder/100/100');
  const [pricingTiers, setPricingTiers] = useState<Omit<PricingTier, 'id'>[]>([{ moq: 1, price: 0 }]);

  useEffect(() => {
    if (product && !isAdding) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setAvailableQuantity(product.available_quantity);
      setImageUrl(product.image_url);
      setPricingTiers(product.pricing_tiers.map(tier => ({ moq: tier.moq, price: tier.price })));
    }
  }, [product, isAdding]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      alert('Product name is required');
      return;
    }

    if (!category.trim()) {
      alert('Category is required');
      return;
    }

    if (pricingTiers.length === 0) {
      alert('At least one pricing tier is required');
      return;
    }

    const formattedPricingTiers = pricingTiers.map((tier, index) => ({
      ...tier,
      id: product && product.pricing_tiers[index] ? product.pricing_tiers[index].id : index + 1
    }));

    const newProduct: any = {
      name,
      description,
      category,
      available_quantity: availableQuantity,
      image_url: imageUrl,
      pricing_tiers: formattedPricingTiers,
      vendor_id: product?.vendor_id || 1
    };

    if (!isAdding) {
      newProduct.id = product?.id;
      newProduct.created_at = product?.created_at;
    }

    onSave(newProduct as Product);
  };

  const handlePricingTierChange = (index: number, field: 'moq' | 'price', value: number): void => {
    const updatedTiers = [...pricingTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setPricingTiers(updatedTiers);
  };

  const addPricingTier = (): void => {
    setPricingTiers([...pricingTiers, { moq: 1, price: 0 }]);
  };

  const removePricingTier = (index: number): void => {
    if (pricingTiers.length > 1) {
      const updatedTiers = pricingTiers.filter((_, i) => i !== index);
      setPricingTiers(updatedTiers);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{isAdding ? "Add New Product" : "Edit Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            value={availableQuantity}
            onChange={(e) => setAvailableQuantity(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Tiers <span className="text-red-500">*</span></label>
          <div className="space-y-2">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <div className="w-2/5">
                  <label className="text-xs text-gray-500">Min. Quantity</label>
                  <input 
                    type="number" 
                    value={tier.moq}
                    onChange={(e) => handlePricingTierChange(index, 'moq', Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div className="w-2/5">
                  <label className="text-xs text-gray-500">Price ($)</label>
                  <input 
                    type="number" 
                    value={tier.price}
                    onChange={(e) => handlePricingTierChange(index, 'price', Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="w-1/5 flex justify-end pt-6">
                  {pricingTiers.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePricingTier(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addPricingTier}
              className="text-blue-500 text-sm font-medium hover:text-blue-700"
            >
              + Add pricing tier
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <button type="button" 
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isAdding ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;