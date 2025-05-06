import React, { useState, useEffect } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Product } from '../product/IProductTypes';
import ProductList from '../product/ProductList';
import ProductDetail from '../product/ProductDetail';
import ProductForm from '../product/ProductForm';
import DeleteConfirmationModal from '../ReUsebleComponents/DeleteConfirmationModal';
import PageHeader from '../layout/PageHeader';
import { useProductAPI } from '../../hooks/useProductAPI';
import ToastService from '../../utils/ToastService';

type SortColumn = 'name' | 'category' | 'stock' | 'price';
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
  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { fetchProducts, updateProduct, deleteProduct, createProduct } = useProductAPI();
  const toastService = ToastService.getInstance();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (): Promise<void> => {
    try {
      const productsResponse = await fetchProducts();
      if (productsResponse.data && Array.isArray(productsResponse.data)) {
        setProducts(productsResponse.data);
        // Extract unique categories from the fetched products
        const uniqueCategories: string[] = [...new Set((productsResponse.data as Product[]).map((product: Product) => product.category))];
        setCategories(['All', ...uniqueCategories]);
      } else {
        console.error("Failed to fetch products:", productsResponse.error);
        toastService.addToast("Failed to fetch products", "error");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toastService.addToast("Error loading products", "error");
    }
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

  const handleCloseProductDetail = (): void => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsAdding(false);
  };

  // Modified to show confirmation modal instead of deleting immediately
  const handleDeleteClick = (product: Product): void => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Actual delete function that will be called after confirmation
  const handleConfirmDelete = async(): Promise<void> => {
    if (!productToDelete) return;

    try {
      const success = await deleteProduct(productToDelete.id);
      if (success) {
        if (selectedProduct && selectedProduct.id === productToDelete.id) {
          setSelectedProduct(null);
        }
        setShowDeleteModal(false);
        setProductToDelete(null);
        toastService.addToast(`Product "${productToDelete.name}" was deleted successfully`, "success");
        loadProducts(); // Reload products after deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toastService.addToast("Failed to delete product", "error");
    }
  };

  const handleCancelDelete = (): void => {
    setShowDeleteModal(false);
    setProductToDelete(null);
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

  const handleSaveProduct = async (product: Product): Promise<void> => {
    try {
      if (isAdding) {
        const newProduct = await createProduct(product);
        setSelectedProduct(newProduct);
        toastService.addToast(`Product "${product.name}" was created successfully`, "success");
      } else if (isEditing && selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, product);
        setSelectedProduct(updatedProduct);
        toastService.addToast(`Product "${product.name}" was updated successfully`, "success");
      }
      
      setIsEditing(false);
      setIsAdding(false);
      loadProducts(); // Reload products after adding/editing
    } catch (error: any) {
      console.error("Error saving product:", error);
      
      // Extract the error message for the user
      let errorMessage = "Failed to save product";
      
      if (error.response) {
        // Check for validation errors from API (422 Unprocessable Entity)
        if (error.response.status === 422) {
          const validationErrors = error.response.data.detail || error.response.data;
          
          // Format validation errors for display
          if (Array.isArray(validationErrors)) {
            // If API returns array of validation errors
            errorMessage = validationErrors.map(err => 
              `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`
            ).join('\n');
          } else if (typeof validationErrors === 'object') {
            // If API returns object with field errors
            errorMessage = Object.entries(validationErrors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join('\n');
          } else if (typeof validationErrors === 'string') {
            // If API returns string error
            errorMessage = validationErrors;
          }
          
          // Display detailed error in console for debugging
          console.error("Validation errors:", validationErrors);
        } else {
          // Other API errors
          errorMessage = error.response.data.detail || error.response.data.message || error.message;
        }
      }
      
      // Show error toast with specific message
      toastService.addToast(`Error: ${errorMessage}`, "error");
    }
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setIsAdding(false);
  };

  // Improved search functionality
  const filteredProducts = products
    .filter(product => {
      // Case insensitive search across multiple fields
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);
      
      // Category filtering
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === 'stock') {
        comparison = a.stock - b.stock;
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <>
      {/* Header */}
      <PageHeader title="Products Dashboard">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
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
      </PageHeader>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Products List */}
        <div
          className={`${
            selectedProduct || isAdding ? 'w-2/3' : 'w-full'
          } overflow-auto p-4 transition-all duration-300`}
        >
          <ProductList 
            products={filteredProducts}
            onSelectProduct={handleSelectProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteClick}
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
              onDelete={() => handleDeleteClick(selectedProduct)}
              onClose={handleCloseProductDetail}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <DeleteConfirmationModal
          productName={productToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default VendorDashboard;