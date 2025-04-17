
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
  const API_URL = 'http://localhost:8000/api/product/';

  

const fetchProducts = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("token", token);

    const response = await axios.get("http://localhost:8000/api/products/mine?page=1&size=10",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    console.log("products", response);
    return  { data: response.data, loading: false, error: null };
    setProducts({ data: response.data, loading: false, error: null });
  } catch (error: any) {
    return { data: null, loading: false, error: error };
    setProducts({ data: null, loading: false, error: error });
  }
}, []);


  // Fetch a single product
  const fetchProductById = useCallback(async (id: number) => {
    setSingleProduct({ data: null, loading: true, error: null });
    
    try {
      // In a real implementation, replace this with your actual API call
      // const response = await fetch(`${API_URL}/${id}`);
      // if (!response.ok) throw new Error('Failed to fetch product');
      // const data = await response.json();
      
      // For demonstration purposes, we're using sample data
      const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const product = allProducts.find((p: Product) => p.id === id);
      
      if (!product) throw new Error('Product not found');
      
      setSingleProduct({ data: product, loading: false, error: null });
    } catch (error) {
      setSingleProduct({ data: null, loading: false, error: error as Error });
    }
  }, []);

  // Create a new product

  // Update an existing product
  const updateProduct = useCallback(async (id: number, product: Partial<Product>) => {
    try {
      // In a real implementation, replace this with your actual API call
      // const response = await fetch(`${API_URL}/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(product)
      // });
      // if (!response.ok) throw new Error('Failed to update product');
      // return await response.json();
      
      // For demonstration purposes, we're using local storage
      const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const index = allProducts.findIndex((p: Product) => p.id === id);
      
      if (index === -1) throw new Error('Product not found');
      
      allProducts[index] = { ...allProducts[index], ...product };
      localStorage.setItem('products', JSON.stringify(allProducts));
      
      return allProducts[index];
    } catch (error) {
      throw error;
    }
  }, []);

  // Delete a product
  const deleteProduct = useCallback(async (id: number) => {
    try {
      // In a real implementation, replace this with your actual API call
      // const response = await fetch(`${API_URL}/${id}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Failed to delete product');
      // return true;
      
      // For demonstration purposes, we're using local storage
      const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const filteredProducts = allProducts.filter((p: Product) => p.id !== id);
      
      localStorage.setItem('products', JSON.stringify(filteredProducts));
      
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    products,
    singleProduct,
    fetchProducts,
    fetchProductById,
    updateProduct,
    deleteProduct
  };
};
