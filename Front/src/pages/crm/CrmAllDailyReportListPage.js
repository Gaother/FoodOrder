import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import CrmDashBoardAllProduct from '../../components/crm-components/dashboard-components/CrmDashBoardMatchedProduct';
import CrmDashBoardMatchCompetitiveRate from '../../components/crm-components/dashboard-components/CrmDashBoardMatchCompetitiveRate';
import CrmListDailyReport from '../../components/crm-components/list-components/CrmDailyReportList';


const CrmAllProductReportList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex flex-col">
        <div className="flex-1 bg-white pb-4 border-2 border-t-0">
            <CrmDashBoardAllProduct/>
        </div>
        <div className="flex-1">
            <CrmDashBoardMatchCompetitiveRate/>
        </div>
        <div className="w-full">
            <div className='p-2 w-full'>
                <CrmListDailyReport/>
            </div>
        </div>
    </div>
  );
};

export default CrmAllProductReportList;
