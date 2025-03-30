import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import SearchBarComponent from './SearchBarComponent';
import OrderListComponent from './OrderListComponent';

const OrdersManagerComponent = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [size, setSize] = useState(50); // Default size per page
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (filters = {}) => {
    try {
      const response = await api.getFilteredCart(filters);
      setMaxPage(response.data.maxPage);
      setFilteredOrders(response.data.carts); // Initial pagination
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
    fetchOrders(searchParams); // Fetch orders based on search criteria
  };

  const handleStatusChange = async (orderId, action) => {
    try {
      await api.CartAdminAction({ action, cartID: orderId });
      fetchOrders(); // Refresh the orders after status change
    } catch (error) {
      console.error('Error changing order status:', error);
    }
  };

  return (
    <div className="p-2 md:p-6 bg-[#f4f4f4]">
      <SearchBarComponent onSearch={handleSearch} page={page} setPage={setPage} size={size} setSize={setSize} maxPage={maxPage}/>
      <OrderListComponent orders={filteredOrders} onStatusChange={handleStatusChange}/>
    </div>
  );
};

export default OrdersManagerComponent;