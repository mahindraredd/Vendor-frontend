import { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { MOCK_ORDERS, STEPS } from '../constants';

export const useOrder = () => { 
  const [currentStep, setCurrentStep] = useState<number>(STEPS.ORDERS);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const navigateBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId) || null;
    setCurrentOrder(order);
    if (order) {
      goToStep(STEPS.ORDER_DETAILS);
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    if (currentOrder?.id === orderId) {
      setCurrentOrder({ ...currentOrder, status });
    }
  };

  const handleDropOff = () => {
    if (currentOrder) {
      updateOrderStatus(currentOrder.id, 'in_transit');
      setShowModal(false);
      goToStep(STEPS.ORDER_COMPLETE);
    }
  };

  const handleDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
  };

  return {
    currentStep,
    showModal,
    orders,
    currentOrder,
    goToStep,
    navigateBack,
    selectOrder,
    updateOrderStatus,
    setShowModal,
    handleDropOff,
    handleDelivered
  };
};
