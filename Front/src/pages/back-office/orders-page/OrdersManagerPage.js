import React, { useState } from 'react';
import OrdersManagerComponent from '../../../components/back-office-components/orders/OrdersManagerComponent';

const OrdersManager = () => {
  const [refreshKeyForTeamManager, setRefreshKeyForTeamManager] = useState(0);
  const [refreshKeyForUserManager, setRefreshKeyForUserManager] = useState(0);

  const handleUserCreated = () => {
    setRefreshKeyForTeamManager((prev) => prev + 1);
  };


  return (
    <div className="pt-4 md:p-0 " style={{ minHeight: "83vh" }}>
      <div className="flex-1 overflow-hidden bg-white px-4 pb-4 md:m-4 md:px-4 md:rounded-md shadow-sm border-2">
        <div className="bg-white flex flex-row items-center justify-between w-full border-b-2 mb-2">
            <h1 className="text-2xl py-7 font-bold text-gray-800">Gérez vos commandes</h1>
        </div>
        <OrdersManagerComponent onUserCreated={handleUserCreated} key={refreshKeyForUserManager} />
      </div>
    </div>
  );
};

export default OrdersManager;
