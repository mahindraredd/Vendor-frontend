import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  AlertCircle,
} from 'lucide-react';
import Toast from './Toast';
import OrderCard from './OrderCard';
import OrderDetail from './OrderDetail';
import ShippingLabelModal from './ShippingLabelModal';
import { MOCK_ORDERS, vendorAddress } from './mockData';
import { Order, OrderStatus } from './types';
import PageHeader from '../layout/PageHeader';

const VendorOrdersDashboard: React.FC = () => {
  // State management
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Filter orders based on status and search text
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      searchText === '' ||
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchText.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Handle status update
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // Update orders state
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Update selected order if it matches
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    showToast('Order status updated successfully!', 'success');
  };

  // Handle label generation
  const handleGenerateLabel = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      // Generate a tracking ID if not exists
      if (!order.trackingId) {
        order.trackingId =
          'TRK-' + Math.floor(10000000 + Math.random() * 90000000);
      }

      setSelectedOrder(order);
      setShowLabelModal(true);
    }
  };

  // Handle print label
  const handlePrintLabel = () => {
    if (selectedOrder) {
      // Mark as label generated
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, labelGenerated: true }
            : order
        )
      );

      setSelectedOrder({ ...selectedOrder, labelGenerated: true });
      setShowLabelModal(false);

      showToast('Shipping label printed successfully!', 'success');
    }
  };

  // Handle download label
  const handleDownloadLabel = () => {
    if (selectedOrder) {
      // Mark as label generated
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, labelGenerated: true }
            : order
        )
      );

      setSelectedOrder({ ...selectedOrder, labelGenerated: true });
      setShowLabelModal(false);

      showToast('Shipping label downloaded successfully!', 'success');
    }
  };

  // Handle mark as shipped (drop-off)
  const handleMarkAsShipped = (orderId: string) => {
    handleUpdateStatus(orderId, 'shipped');
    showToast('Order marked as shipped! Drop-off completed.', 'success');
  };

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Close order detail panel
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  // Save status changes
  const handleSaveStatus = () => {
    if (selectedOrder) {
      showToast('Order status saved successfully!', 'success');
    }
  };

  return (
    <>
      {/* Header */}
      <PageHeader title="Orders Dashboard">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <select
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </PageHeader>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Orders List - Make it even smaller when detail is open */}
        <div
          className={`${
            isDetailOpen ? 'w-1/5' : 'w-2/3'
          } overflow-y-auto p-4 transition-all duration-300`}
        >
          <h3 className="text-lg font-bold mb-4">Orders ({filteredOrders.length})</h3>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => handleSelectOrder(order)}
                onUpdateStatus={handleUpdateStatus}
                onGenerateLabel={handleGenerateLabel}
                onMarkAsShipped={handleMarkAsShipped}
                isSelected={selectedOrder?.id === order.id}
              />
            ))}

            {filteredOrders.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No orders found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Side Panel - Make it even larger when detail is open */}
        {isDetailOpen && selectedOrder ? (
          <div className="w-4/5 bg-white border-l overflow-y-auto transition-all duration-300">
            <OrderDetail
              order={selectedOrder}
              onClose={handleCloseDetail}
              onUpdateStatus={handleUpdateStatus}
              onGenerateLabel={handleGenerateLabel}
              onMarkAsShipped={handleMarkAsShipped}
              onSaveStatus={handleSaveStatus}
            />
          </div>
        ) : (
          <div className="w-1/3 bg-white border-l flex items-center justify-center transition-all duration-300">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Select an order to view details
              </h3>
              <p className="text-gray-500 text-sm">
                Click on any order from the list to view its details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Label Modal */}
      {showLabelModal && selectedOrder && (
        <ShippingLabelModal
          order={selectedOrder}
          vendorAddress={vendorAddress}
          onClose={() => setShowLabelModal(false)}
          onPrint={handlePrintLabel}
          onDownload={handleDownloadLabel}
        />
      )}

      {/* Toast */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </>
  );
};

export default VendorOrdersDashboard;