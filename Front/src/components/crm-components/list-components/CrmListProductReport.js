import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../components/AuthContext';
import api from '../../../api/api'
import ProductTable from './CrmTableProductReport';
// Autres imports ...

const CrmListProductReport = () => {

  return (
    <div>
      <ProductTable/>
    </div>
  );
};

export default CrmListProductReport;
