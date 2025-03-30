import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import AtlasDashBoardAllProduct from '../../components/atlas-components/dashboard-components/AtlasDashBoardMatchedProduct';
import AtlasDashBoardMatchCompetitiveRate from '../../components/atlas-components/dashboard-components/AtlasDashBoardMatchCompetitiveRate';
import AtlasListDailyReport from '../../components/atlas-components/list-components/AtlasDailyReportList';


const AtlasAllProductReportList = () => {
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
            <AtlasDashBoardAllProduct/>
        </div>
        <div className="flex-1">
            <AtlasDashBoardMatchCompetitiveRate/>
        </div>
        <div className="w-full">
            <div className='p-2 w-full'>
                <AtlasListDailyReport/>
            </div>
        </div>
    </div>
  );
};

export default AtlasAllProductReportList;
