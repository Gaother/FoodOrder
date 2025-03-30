import React, { useState, useEffect } from 'react';
import OrderItemComponent from './OrderItemComponent'; // Assuming you have this component separately

const OrderListComponent = ({ orders, onStatusChange }) => {
  return (
    <div className="flex flex-col">      
      {/* Order List */}
      <div className="flex flex-wrap gap-4">
        {orders.map((order) => (
          <OrderItemComponent key={order._id} order={order} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
};

export default OrderListComponent;