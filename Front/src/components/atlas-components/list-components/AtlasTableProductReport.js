import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation, createSearchParams } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../../api/api'
import { FaSearch } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import ProductRow from './AtlasProductReportRow';
import ProductHeader from './AtlasProductReportHeader';
import Pagination from './AtlasPagination';
import PageSizeSelector from './AtlasPageSizeSelector';
import ProductReportsCSVButton from '../AtlasProductReportCSVButton';
import LoadingSpinner from '../../LoadingComponent';

const AtlasProductTable = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const rate = query.get('rate');
    const dailyId = query.get('daily_id');
    const history = query.get('history') || new Date().toISOString().split('T')[0]; // Default to today's date if not present
    const dailyReport = null;
    const [products, setProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        lesscost: query.get('lesscost') === 'true' ? true : query.get('lesscost') === 'false' ? false : undefined,
        maxdiffpourcent: query.get('maxdiffpourcent') === 'true' ? true : query.get('maxdiffpourcent') === 'false' ? false : undefined,
        maxdiff: query.get('maxdiff') === 'true' ? true : query.get('maxdiff') === 'false' ? false : undefined
    });
    const [searchTerms, setSearchTerms] = useState(query.get('name') ? { name: query.get('name').split('+').join(' ') } : {});
    const [currentPage, setCurrentPage] = useState(query.get('page') || 1);
    const [size, setSize] = useState(query.get('size') || "50");
    const [totalPages, setTotalPages] = useState(0);
    const [totalFilteredProducts, setTotalFilteredProducts] = useState(0);
    const [rateComment, setRateComment] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [isLoggedIn, navigate, sortConfig, searchTerms, currentPage, size, rate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [size]);

    const fetchData = async () => {
        // Assembler tous les paramètres pour l'appel API
        const params = { ...sortConfig, ...searchTerms, page: currentPage, size };
        if (rate) {
            let dailyReport = null;
            if (dailyId) {
                try {
                    const response = await api.getDailyReportById(dailyId);
                    if (response.status === 200) {
                        dailyReport = response.data;
                        params.daily_id = dailyId;
                        params.history = history;
                    } else {
                        console.error('Error retrieving daily report');
                    }
                } catch (error) {
                    console.error('Fetching data failed', error);
                }
            }
            if (rate === "comp") {
                params.rate = "comp";
                setRateComment(" Produits compétitifs");
                if (dailyId)
                    params.id = dailyReport.newCompetitiveProductReports.join(",");
            } else if (rate === "equal") {
                params.rate = "equal";
                setRateComment(" Produits aux mêmes prix");
                if (dailyId)
                    params.id = dailyReport.newEqualProductReports.join(",");
            } else if (rate === "non-comp") {
                params.rate = "non-comp";
                setRateComment(" Produits non compétitifs");
                if (dailyId)
                    params.id = dailyReport.newNonCompetitiveProductReports.join(",");
            } else if (rate === "promo") {
                params.rate = "promo";
                setRateComment(" Produits en promotion");
                // if (dailyId)
                //     params.id = dailyReport.newDiscountProductReports.join(",");
            }
        }
        if (currentPage) {
            params.page = currentPage;
        }
        const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {  // Vérifie que la valeur n'est pas undefined
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
            const response = await api.getFilteredProductReport(params);
            if (response.status === 200) {
                setProducts(response.data.products);
                setTotalPages(response.data.infos.totalpages);
                setTotalFilteredProducts(response.data.infos.totalfilteredproducts);
                setLoading(false);
            } else {
                console.error('Error retrieving filtered report');
                setLoading(false);
            }
        } catch (error) {
            console.error('Fetching data failed', error);

        }
    };

    const handleSearchChange = (field, value) => {
        setSearchTerms({ ...searchTerms, [field]: value });
    };
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


return (
    <div className="overflow-x-auto w-full max-w-80vw lg:max-w-full">
        <div className="flex flex-col items-center mb-4">
            <div className="flex flex-row items-center text-4xl">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <span className="text-gray-500">
                    {new Date(history).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                </span>
            </div>
            <div className="text-gray-500 text-2xl">
                {rateComment}
            </div>
        </div>
        <div className="flex flex-row items-center my-4">
            <div className='w-auto mr-8'>
                <PageSizeSelector onSizeChange={setSize} totalFilteredProducts={totalFilteredProducts} />
            </div>
            <div className='w-1/12 mx-8'>
                <Pagination onPageChange={handlePageChange} initialPage={1} totalPages={totalPages} currentPage={currentPage}/>
            </div>
            <div className='w-1/12'>
                <ProductReportsCSVButton/>
            </div>
        </div>
        <table className="w-full bg-transparent table-fixed border-separate .custom-table-spacing" style={{ borderSpacing: '0 1em' }}>
            <thead>
                <tr className='bg-gray-200'>
                    <ProductHeader title="NOM" field="name" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={3} />
                    <ProductHeader title="REF." field="name" showSearch={true} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={2}/>
                    <ProductHeader title="ORIGIN" field="" showSearch={false} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1}/>
                    <ProductHeader
                        title="PRIX - cher"
                        field="lesscost"
                        showSearch={false}
                        showSort={!rate}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        onSearchChange={handleSearchChange}
                        width={1}
                    />
                    <ProductHeader title="DIFF.%" field="maxdiffpourcent" showSearch={false} showSort={true} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1}/>
                    <ProductHeader title="DIFF." field="maxdiff" showSearch={false} showSort={true} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1}/>
                    <ProductHeader title="CONCUR." field="" showSearch={false} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1}/>
                    <ProductHeader title="" field="" showSearch={false} showSort={false} sortConfig={sortConfig} setSortConfig={setSortConfig} onSearchChange={handleSearchChange} width={1}/>
                </tr>
            </thead>
            {loading ? (
                <LoadingSpinner/>
            ) : (
                <tbody>
                    {products.map((product) => (
                        <ProductRow product={product} />
                    ))}
                </tbody>
            )}
        </table>
    </div>
    );
};


export default AtlasProductTable;
