import React, { useState, useEffect } from 'react';
import { Save, X, Plus } from 'lucide-react';

// Interface definitions
interface PricingTier {
  id: number;
  moq: number;
  price: number;
}

interface Product {
  name: string;
  description: string;
  category: string;
  image_url: string;
  available_quantity: number;
  id: number;
  vendor_id: number;
  created_at: string;
  pricing_tiers: PricingTier[];
}

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
  const [imageUrl, setImageUrl] = useState<string>('/api/placeholder/200/200');
  const [pricingTiers, setPricingTiers] = useState<Omit<PricingTier, 'id'>[]>([
    { moq: 1, price: 0 }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categories that could be fetched from API in a real scenario
  const categories = [
    'Clothing', 'Electronics', 'Home & Kitchen', 'Beauty', 
    'Toys & Games', 'Books', 'Food & Grocery', 'Health', 'Other'
  ];

  // Initialize form with existing product data if editing
  useEffect(() => {
    if (product && !isAdding) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setAvailableQuantity(product.available_quantity);
      setImageUrl(product.image_url);
      
      if (product.pricing_tiers && product.pricing_tiers.length > 0) {
        setPricingTiers(product.pricing_tiers.map(tier => ({ 
          moq: tier.moq, 
          price: tier.price 
        })));
      }
    }
  }, [product, isAdding]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!category) newErrors.category = 'Please select a category';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (availableQuantity <= 0) newErrors.availableQuantity = 'Quantity must be greater than 0';
    if (!imageUrl) newErrors.imageUrl = 'Image URL is required';
    
    if (pricingTiers.length === 0) {
      newErrors.pricingTiers = 'At least one pricing tier is required';
    } else {
      pricingTiers.forEach((tier, index) => {
        if (tier.moq <= 0) newErrors[`tier_${index}_moq`] = 'Minimum order quantity must be greater than 0';
        if (tier.price <= 0) newErrors[`tier_${index}_price`] = 'Price must be greater than 0';
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formattedPricingTiers = pricingTiers.map((tier, index) => ({
        ...tier,
        id: product && product.pricing_tiers && product.pricing_tiers[index]
          ? product.pricing_tiers[index].id
          : index + 1
      }));

      const newProduct: any = {
        name,
        description,
        category,
        available_quantity: availableQuantity,
        image_url: imageUrl,
        pricing_tiers: formattedPricingTiers,
        vendor_id: product?.vendor_id || 1,
      };

      // If editing, include the existing id and created_at
      if (!isAdding && product) {
        newProduct.id = product.id;
        newProduct.created_at = product.created_at;
      }

      onSave(newProduct as Product);
      
    }
  };

  const addPricingTier = () => {
    const lastTier = pricingTiers[pricingTiers.length - 1];
    const newMoq = lastTier ? lastTier.moq + 10 : 1;
    
    setPricingTiers([...pricingTiers, { moq: newMoq, price: 0 }]);
  };

  const removePricingTier = (index: number) => {
    if (pricingTiers.length > 1) {
      setPricingTiers(pricingTiers.filter((_, i) => i !== index));
    }
  };

  const updatePricingTier = (index: number, field: 'moq' | 'price', value: number) => {
    const updatedTiers = [...pricingTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setPricingTiers(updatedTiers);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{isAdding ? "Add New Product" : "Edit Product"}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Basic info and image */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start">
                <img 
                  src={imageUrl} 
                  alt="Product preview" 
                  className="w-20 h-20 object-cover border rounded mr-3"
                />
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                      ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Image URL"
                  />
                  {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. Organic Cotton T-shirt"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${errors.availableQuantity ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
              />
              {errors.availableQuantity && <p className="text-red-500 text-xs mt-1">{errors.availableQuantity}</p>}
            </div>
          </div>
          
          {/* Right column - Description and pricing */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Provide a detailed description of your product..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pricing Tiers <span className="text-red-500">*</span>
                </label>
                <button 
                  type="button"
                  onClick={addPricingTier}
                  className="text-blue-500 text-sm font-medium hover:text-blue-700 flex items-center"
                >
                  <Plus size={16} className="mr-1" /> Add tier
                </button>
              </div>
              
              {errors.pricingTiers && <p className="text-red-500 text-xs mb-2">{errors.pricingTiers}</p>}
              
              <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-8 gap-2 text-xs text-gray-500 font-medium mb-1">
                  <div className="col-span-3">Min. Quantity</div>
                  <div className="col-span-3">Price ($)</div>
                  <div className="col-span-2"></div>
                </div>
                
                {pricingTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-8 gap-2 items-center">
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        value={tier.moq}
                        onChange={(e) => updatePricingTier(index, 'moq', Number(e.target.value))}
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                          ${errors[`tier_${index}_moq`] ? 'border-red-500' : 'border-gray-300'}`}
                        min="1"
                      />
                      {errors[`tier_${index}_moq`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`tier_${index}_moq`]}</p>
                      )}
                    </div>
                    
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        value={tier.price}
                        onChange={(e) => updatePricingTier(index, 'price', Number(e.target.value))}
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                          ${errors[`tier_${index}_price`] ? 'border-red-500' : 'border-gray-300'}`}
                        min="0"
                        step="0.01"
                      />
                      {errors[`tier_${index}_price`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`tier_${index}_price`]}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2 flex justify-end">
                      {pricingTiers.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removePricingTier(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Save size={18} className="mr-2" />
            {isAdding ? "Add Product" : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;