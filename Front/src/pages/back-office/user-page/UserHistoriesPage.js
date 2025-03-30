import React, { useState } from 'react';
import UserHistoriesManagerComponent from '../../../components/back-office-components/user/UserHistoriesManagerComponent';

const UserHistories = () => {

  return (
    <div className="pt-4 md:p-0" style={{ minHeight: "83vh" }}>
      <div className="flex-1 overflow-hidden bg-white md:m-4 px-4 md:rounded-md shadow-sm border-2">
        <UserHistoriesManagerComponent/>
      </div>
    </div>
  );
};

export default UserHistories;
