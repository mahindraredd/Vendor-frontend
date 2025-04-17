import { Product } from "../product/IProductTypes";

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      // In a real implementation, replace this with your actual API call
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/products/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
      
      // For demonstration purposes, we're using local storage
      const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const newId = allProducts.length > 0 ? Math.max(...allProducts.map((p: Product) => p.id)) + 1 : 1;
      
      const newProduct = {
        ...product,
        id: newId,
        created_at: new Date().toISOString()
      };
      
      allProducts.push(newProduct);
      localStorage.setItem('products', JSON.stringify(allProducts));
      
      return newProduct;
    } catch (error) {
      throw error;
    }
  }