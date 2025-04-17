// VendorDashboard.tsx - Main dashboard component
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Product, PricingTier } from '../product/IProductTypes';
import { ProductService } from '../product/ProductService';
import ProductList from '../product/ProductList';
import ProductDetail from '../product/ProductDetail';
import ProductForm from '../product/ProductForm';
import "./VendorDashboard.css"
import { useProductAPI } from '../../hooks/useProductAPI';

type SortColumn = 'name' | 'category' | 'quantity' | 'price';
type SortDirection = 'asc' | 'desc';

const VendorDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(['All']);

  const productService = ProductService.getInstance();
 const {fetchProducts} = useProductAPI();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (): Promise<void> => {

    const productsResponse = await fetchProducts();
    if (productsResponse.data) {
        setProducts(productsResponse.data);
    } else {
        console.error("Failed to fetch products:", productsResponse.error);
    }
    
    const allCategories = ['All', ...productService.getCategories()];
    setCategories(allCategories);
  };

  const handleSort = (column: SortColumn): void => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleSelectProduct = (product: Product): void => {
    setSelectedProduct(product);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleDeleteProduct = (id: number): void => {
    const success = productService.deleteProduct(id);
    if (success) {
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
      }
      loadProducts();
    }
  };

  const handleAddProduct = (): void => {
    setIsAdding(true);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleEditProduct = (product: Product): void => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleSaveProduct = (product: Product): void => {
    if (isAdding) {
        
      const newProduct = productService.addProduct(product);
      setSelectedProduct(newProduct);
    } else if (isEditing && selectedProduct) {
      const updatedProduct = productService.updateProduct(selectedProduct.id, product);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      }
    }
    
    setIsEditing(false);
    setIsAdding(false);
    loadProducts();
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setIsAdding(false);
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === 'quantity') {
        comparison = a.available_quantity - b.available_quantity;
      } else if (sortBy === 'price') {
        // Sort by lowest price tier
        const aPrice = a.pricing_tiers[0]?.price || 0;
        const bPrice = b.pricing_tiers[0]?.price || 0;
        comparison = aPrice - bPrice;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendor Product Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <PlusCircle size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Products List */}
        <div className="w-2/3 overflow-auto p-4">
          <ProductList 
            products={filteredProducts}
            onSelectProduct={handleSelectProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            selectedProductId={selectedProduct?.id}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>

        {/* Product Detail Panel */}
        <div className="w-1/3 bg-white border-l p-4 overflow-auto">
          {selectedProduct && !isEditing && !isAdding && (
            <ProductDetail 
              product={selectedProduct}
              onEdit={() => setIsEditing(true)} 
              onDelete={() => handleDeleteProduct(selectedProduct.id)}
            />
          )}

          {(isEditing || isAdding) && (
            <ProductForm 
              product={isEditing ? selectedProduct : null}
              onSave={handleSaveProduct}
              onCancel={handleCancelEdit}
              isAdding={isAdding}
            />
          )}

          {!selectedProduct && !isAdding && (
            <div className="h-full flex items-center justify-center text-gray-400 flex-col">
              <img src="/api/placeholder/200/200" alt="Select a product" className="mb-4 opacity-30" />
              <p>Select a product to view details</p>
              <p className="text-sm">or</p>
              <button 
                onClick={handleAddProduct}
                className="mt-2 text-blue-500 hover:underline font-medium flex items-center"
              >
                <PlusCircle size={16} className="mr-1" />
                Add a new product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;