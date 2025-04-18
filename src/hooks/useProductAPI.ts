
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
    const response = await axios.post(`${API_URL}/products`, product, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}, []);
  
// Update an existing product
const updateProduct = useCallback(async (id: number, product: Partial<Product>) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, product, {
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
