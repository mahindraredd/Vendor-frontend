import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Plus, Trash, Upload, ImagePlus } from 'lucide-react';
import { Product, PricingTier } from './IProductTypes';
import ImageUploadService from '../services/ImageUploadService';

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
  const [stock, setStock] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>(['/api/placeholder/200/200']);
  const [pricingTiers, setPricingTiers] = useState<Omit<PricingTier, 'id'>[]>([
    { moq: 1, price: 0 }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setStock(product.stock);
      setBasePrice(product.price);
      
      if (product.image_urls && product.image_urls.length > 0) {
        setImageUrls(product.image_urls);
      }
      
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
    if (stock <= 0) newErrors.stock = 'Quantity must be greater than 0';
    if (basePrice <= 0) newErrors.basePrice = 'Base price must be greater than 0';
    if (imageUrls.length === 0) newErrors.imageUrls = 'At least one product image is required';
    
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

  // Function to upload images and get URLs
  const uploadImages = async (): Promise<string[]> => {
    // If no new files were uploaded, return the existing URLs
    if (imageFiles.length === 0) {
      // Filter out the placeholder image
      return imageUrls.filter(url => url !== '/api/placeholder/200/200');
    }
    
    try {
      setUploading(true);
      
      // Use our ImageUploadService to upload the files
      const imageUploadService = ImageUploadService.getInstance();
      
      const uploadResults = await imageUploadService.uploadMultipleImages(
        imageFiles,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      console.log("Upload results:", uploadResults);

      // Extract successful uploads
      const newImageUrls = uploadResults
        .filter(result => result.success)
        .map(result => result.url);
      
      // If any uploads failed, show an alert
      const failedUploads = uploadResults.filter(result => !result.success).length;

      if (failedUploads > 0) {
        alert(`${failedUploads} image(s) failed to upload. Please try again.`);
      }
      
      // Combine existing valid URLs (not placeholders or data URLs) with new ones
      const validExistingUrls = imageUrls.filter(url => 
        url !== '/api/placeholder/200/200' && !url.startsWith('data:')
      );
      
      return [...validExistingUrls, ...newImageUrls];
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    } finally {
      setUploading(false);
      // Clear the array of pending image files
      setImageFiles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // First, upload any new images and get the URLs
        const uploadedImageUrls = await uploadImages();
        console.log("Uploaded image URLs:", uploadedImageUrls);
        
        // Ensure numeric values are actual numbers
        const formattedPricingTiers = pricingTiers.map((tier, index) => ({
          moq: Number(tier.moq),
          price: Number(tier.price),
          id: product && product.pricing_tiers && product.pricing_tiers[index]
            ? product.pricing_tiers[index].id
            : index + 1
        }));
  
        // Build product object exactly matching API expectations
        const newProduct: any = {
          name: name.trim(),  // Trim whitespace
          description: description.trim(),  // Trim whitespace
          category: category,
          stock: Number(stock),  // Ensure it's a number
          price: Number(basePrice),  // Ensure it's a number
          image_urls: uploadedImageUrls,  // Array of valid image URLs
          pricing_tiers: formattedPricingTiers,
        };
        
        // Only include vendor_id for new products
        if (isAdding) {
          newProduct.vendor_id = 1;  // Or get this from auth context/storage
        }
  
        // If editing, include the existing id
        if (!isAdding && product) {
          newProduct.id = product.id;
          
          // Include created_at only if it exists
          if (product.created_at) {
            newProduct.created_at = product.created_at;
          }
        }
        
        // Log the payload for debugging
        console.log("Product payload:", JSON.stringify(newProduct, null, 2));
  
        onSave(newProduct as Product);
      } catch (error) {
        console.error("Error submitting product:", error);
        // You would typically show an error message to the user here
        alert("Failed to save product. Please try again.");
      }
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

  const removeImage = async (index: number) => {
    if (imageUrls.length > 1) {
      const urlToRemove = imageUrls[index];
      
      // If this is a real URL (not a local preview), try to delete it from the server
      if (urlToRemove !== '/api/placeholder/200/200' && !urlToRemove.startsWith('data:')) {
        try {
          // Delete the image from the server
          const imageUploadService = ImageUploadService.getInstance();
          await imageUploadService.deleteImage(urlToRemove);
        } catch (error) {
          console.error("Error deleting image from server:", error);
          // Continue with local removal even if server deletion fails
        }
      }
      
      // Remove from local URLs array
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
      
      // Also remove from files array if this was a pending upload
      if (urlToRemove.startsWith('data:')) {
        // Find the corresponding file in the imageFiles array and remove it
        const newImageFiles = [...imageFiles];
        newImageFiles.splice(index, 1);
        setImageFiles(newImageFiles);
      }
    }
  };

  // State to store the actual file objects
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed 6 images
    if (imageUrls.length + files.length > 6) {
      alert("You can upload a maximum of 6 images per product.");
      return;
    }

    // Clear default placeholder if it's the only image
    if (imageUrls.length === 1 && imageUrls[0] === '/api/placeholder/200/200') {
      setImageUrls([]);
    }

    setUploading(true);
    
    // Process each file
    Array.from(files).forEach(file => {
      // Store the actual file object for later upload
      setImageFiles(prevFiles => [...prevFiles, file]);
      
      // Simulate upload progress for UI feedback
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 200);

      // Create a temporary preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // For preview only, we'll use data URLs
          setImageUrls(prevUrls => [...prevUrls, event.target!.result as string]);
          
          clearInterval(progressInterval);
          setUploadProgress(0);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the file input to allow uploading the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{isAdding ? "Add New Product" : "Edit Product"}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Basic info and image */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">(Max 6 images)</span>
              </label>
              
              {/* Image gallery */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-24 object-cover border rounded"
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
                
                {/* Add image button - only show if less than 6 images */}
                {imageUrls.length < 6 && (
                  <div 
                    className="w-full h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={triggerFileInput}
                  >
                    <div className="text-center">
                      <ImagePlus size={24} className="mx-auto text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add Image</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Hidden file input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              {/* Upload button */}
              <div className="flex items-center mb-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={imageUrls.length >= 6 || uploading}
                  className={`flex items-center px-3 py-2 text-sm rounded-md mr-2 ${
                    imageUrls.length >= 6 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Upload size={16} className="mr-1" />
                  Upload Images
                </button>
                <span className="text-xs text-gray-500">
                  {imageUrls.length}/6 images
                </span>
              </div>
              
              {/* Upload progress */}
              {uploading && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Uploading...</span>
                    <span className="text-xs text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.imageUrls && <p className="text-red-500 text-xs mt-1">{errors.imageUrls}</p>}
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
                Stock <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${errors.basePrice ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
                step="0.01"
              />
              {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
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
            disabled={uploading}
            className={`flex items-center px-4 py-2 rounded-lg ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
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