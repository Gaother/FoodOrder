import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation, createSearchParams } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../../api/api'
import { FaSearch } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import ProductRow from './CrmProductReportRow';
import ProductHeader from './CrmProductReportHeader';
import Pagination from './CrmPagination';
import PageSizeSelector from './CrmPageSizeSelector';
import ProductReportsCSVButton from '../CrmProductReportCSVButton';
import LoadingSpinner from '../../LoadingComponent';

const CrmProductTable = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [customers, setCustomers] = useState([]);
    const [sortConfig, setSortConfig] = useState({});
    const [searchTerms, setSearchTerms] = useState({
        firstname: query.get('firstname') || '',
        lastname: query.get('lastname') || '',
        email: query.get('email') || '',
        phone: query.get('phone') || '',
        prestashopIds: query.get('prestashopIds') || '',
        originSite: query.get('originSite') || '',
        orderReference: query.get('orderReference') || ''
    });
    const [size, setSize] = useState(query.get('size') || '50');
    const [currentPage, setCurrentPage] = useState(query.get('page') || 1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalFilteredCustomers, setTotalFilteredCustomers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [isLoggedIn, navigate, sortConfig, searchTerms, currentPage, size]);

    useEffect(() => {
        setCurrentPage(1);
    }, [size]);

    const fetchData = async () => {
        const params = { ...sortConfig, ...searchTerms, page: currentPage, size };
        const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '') {  // Exclude undefined and empty values
                acc[key] = value;
            }
            return acc;
        }, {});

        const queryString = createSearchParams(cleanParams);
        navigate({
            pathname: location.pathname,
            search: queryString.toString()
        });

        try {
            setLoading(true);
            const response = await api.getFilteredCustomer(cleanParams);
            if (response.status === 200) {
                setCustomers(response.data.customers);
                setTotalPages(response.data.infos.totalpages);
                setTotalFilteredCustomers(response.data.infos.totalfilteredcustomers);
                setLoading(false);
            } else {
                console.error('Error retrieving filtered customers');
                setLoading(false);
            }
        } catch (error) {
            console.error('Fetching data failed', error);
            setLoading(false);
        }
    };

    const handleSearchChange = (field, value) => {
        setSearchTerms({ ...searchTerms, [field]: value });
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="overflow-x-auto w-full max-w-80vw lg:max-w-full">
            <div className="flex flex-row items-center my-4">
                <div className='w-auto mr-8'>
                    <PageSizeSelector onSizeChange={setSize} totalFilteredProducts={totalFilteredCustomers} />
                </div>
                <div className='w-1/12 mx-8'>
                    <Pagination onPageChange={handlePageChange} initialPage={1} totalPages={totalPages} currentPage={currentPage} />
                </div>
                <div className='w-1/12'>
                    <ProductReportsCSVButton />
                </div>
            </div>
            <table className="w-full bg-gray-200 table-fixed border-separate border-2 rounded-md px-2" style={{ borderSpacing: '0 1em' }}>
                <thead>
                    <tr className='bg-gray-200'>
                        <ProductHeader title="OriginSite" field="originSite" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1} />
                        <ProductHeader title="PrestaId" field="prestashopIds" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1} />
                        <ProductHeader title="Dernière Commande" field="orderReference" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1} />
                        <ProductHeader title="Nom" field="lastname" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={2} />
                        <ProductHeader title="Prénom" field="firstname" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={2} />
                        <ProductHeader title="Email" field="email" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={2} />
                        <ProductHeader title="n°" field="phone" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={2} />
                        <ProductHeader title="" field="" showSearch={false} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1} />
                    </tr>
                </thead>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <tbody>
                        {customers.map((customer) => (
                            <ProductRow key={customer._id} customer={customer} />
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    );
};

export default CrmProductTable;