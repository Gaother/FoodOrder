import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import CrmDashBoardAllProduct from '../../components/crm-components/dashboard-components/CrmDashBoardMatchedProduct';
import CrmDashBoardMatchCompetitiveRate from '../../components/crm-components/dashboard-components/CrmDashBoardMatchCompetitiveRate';
import CrmListProductReport from '../../components/crm-components/list-components/CrmListProductReport';

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
        </div>
        <div className="flex-1">
            <div className='p-2'>
                <CrmListProductReport/>
            </div>
        </div>
    </div>
  );
};

export default CrmAllProductReportList;
