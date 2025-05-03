import { useState, useEffect, useCallback } from 'react';
import { Product } from '../components/product/IProductTypes';
import axios from "axios";

// Define the API response interface
interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Define the hook
export const useProductAPI = () => {
  const [products, setProducts] = useState<ApiResponse<Product[]>>({
    data: null,
    loading: false,
    error: null
  });

  const [singleProduct, setSingleProduct] = useState<ApiResponse<Product>>({
    data: null,
    loading: false,
    error: null
  });

  // API URL - Replace with your actual API endpoint
  const API_URL = 'http://localhost:8000/api';

  // Helper to get the auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setProducts({ data: null, loading: true, error: null });
      
      const response = await axios.get(`${API_URL}/products/mine?page=1&size=10`, {
        headers: getAuthHeaders()
      });
      
      const result = { data: response.data, loading: false, error: null };
      setProducts(result);
      return result;
    } catch (error: any) {
      const result = { data: null, loading: false, error: error };
      setProducts(result);
      return result;
    }
  }, []);

  // Fetch a single product
  const fetchProductById = useCallback(async (id: number) => {
    try {
      setSingleProduct({ data: null, loading: true, error: null });
      
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: getAuthHeaders()
      });
      
      const result = { data: response.data, loading: false, error: null };
      setSingleProduct(result);
      return result;
    } catch (error: any) {
      const result = { data: null, loading: false, error: error };
      setSingleProduct(result);
      return result;
    }
  }, []);

  // Create a new product
  const createProduct = useCallback(async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      // Filter out any data URLs from image_urls - these should have been uploaded separately
      const validImageUrls = product.image_urls.filter(url => 
        !url.startsWith('data:') && url !== '/api/placeholder/200/200'
      );
      console.log("Valid image URLs:", product.image_urls);
      
      // Make sure pricing tiers have proper numeric values
      const formattedPricingTiers = product.pricing_tiers.map(tier => ({
        moq: Number(tier.moq),  // Ensure it's a number
        price: Number(tier.price)  // Ensure it's a number
      }));
      
      // Prepare the payload according to API requirements
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('stock', String(product.stock));  // Convert to string for FormData
      formData.append('price', String(product.price));  // Convert to string for FormData

      // Append pricing tiers as a JSON string
      formData.append('pricing_tiers', JSON.stringify(formattedPricingTiers));

      // Append valid image URLs
      product.image_urls.forEach((url) => {
        if (url.startsWith('data:')) {
          const binary = atob(url.split(',')[1]);
          const array = [];
          for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
          formData.append('images', blob, `image_${Date.now()}.jpg`);
        }
      });
      // Debug logging - check the FormData content
      console.log("Sending product FormData to API:", formData);

      const response = await axios.post(`${API_URL}/products/`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating product:", error);
      
      // Enhanced error logging for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        
        // Log more details if available in the response
        if (error.response.data && error.response.data.detail) {
          console.error("API error details:", error.response.data.detail);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
      }
      
      throw error;
    }
  }, []);
  
  // Update an existing product
  const updateProduct = useCallback(async (id: number, product: Partial<Product>) => {
    try {
      // Prepare the payload for update
      const payload: any = {};
      
      // Only include fields that were provided
      if (product.name !== undefined) payload.name = product.name;
      if (product.description !== undefined) payload.description = product.description;
      if (product.category !== undefined) payload.category = product.category;
      if (product.stock !== undefined) payload.stock = product.stock;
      if (product.price !== undefined) payload.price = product.price;
      
      // Filter out data URLs from image_urls if provided
      if (product.image_urls !== undefined) {
        payload.image_urls = product.image_urls.filter(url => 
          !url.startsWith('data:') && url !== '/api/placeholder/200/200'
        );
      }
      
      if (product.pricing_tiers !== undefined) {
        payload.pricing_tiers = product.pricing_tiers.map(tier => ({
          id: tier.id,
          moq: tier.moq,
          price: tier.price
        }));
      }
      
      const response = await axios.patch(`${API_URL}/products/${id}`, payload, {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }, []);

  // Delete a product
  const deleteProduct = useCallback(async (id: number) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: getAuthHeaders()
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }, []);

  return {
    products,
    singleProduct,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
};