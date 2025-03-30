import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import api from '../../api/api';
import BottomMenu from '../../components/inventory-components/StockBottomMenu';
import StockHistoryModal from '../../components/inventory-components/StockHistoryModal'; //
import { FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const WarehouseProductList = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [userTeamId, setUserTeamId] = useState('');
    const [userTeamName, setUserTeamName] = useState('');
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const rowsPerPage = 10;

    

    useEffect(() => {
        if (!isLoggedIn) {
            // Redirigez l'utilisateur vers la page d'accueil s'il est déjà connecté
            navigate('/login');
        }
        fetchUserTeam();
    }, []);

    useEffect(() => {
        if (userTeamId) {
            getAllWarehouses(userTeamId);
        }
    }, [userTeamId]);

    useEffect(() => {
        if (selectedWarehouseId) {
            fetchProductsByWarehouse(selectedWarehouseId);
        }
    }, [selectedWarehouseId]);

    useEffect(() => {
        const searchWords = searchTerm.trim().split(/\s+/); // Diviser la chaîne de recherche en mots et ignorer les espaces
        const filtered = products.filter(product => 
            searchWords.every(word => 
                product.denomination.toLowerCase().includes(word.toLowerCase()) || 
                product.reference.toLowerCase().includes(word.toLowerCase())
            )
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    useEffect(() => {
        setCurrentPage(1); // Réinitialiser la page à 1 lorsque searchTerm change
    }, [searchTerm]);


    const fetchUserTeam = async () => {
        try {
            const response = await api.getUserTeam();
            if (response.data.team === "Aucune")
                navigate('/');
            setUserTeamId(response.data.team);
            const teamResponse = await api.getTeamById(response.data.team);
            setUserTeamName(teamResponse.data.name);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'équipe de l\'utilisateur:', error);
        }
    };

    const getAllWarehouses = async (teamId) => {
        try {
            const response = await api.getAllWarehouse();
            const assignedWarehouses = response.data.filter(warehouse => 
                warehouse.listAssignedTeam.some(team => team._id === teamId)
            );
            setFilteredWarehouses(assignedWarehouses);
        } catch (error) {
            console.error('Erreur lors de la récupération des entrepôts:', error);
        }
    };

    const fetchProductsByWarehouse = async (warehouseId) => {
        try {
            const response = await api.getAllProductByWarehouse(warehouseId);
            // console.log(response.data);
            const teamProducts = response.data.filter(product => 
                product.assignedTeam === userTeamId
            );
            setProducts(teamProducts);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
        }
    };

    const handleProductAdded = async () => {
        if (selectedWarehouseId) {
            await fetchProductsByWarehouse(selectedWarehouseId);
        }
    };

    // Récupérer les produits pour la page actuelle
    const currentTableData = filteredProducts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const paginationNumbers = () => {
        const pages = [];
        const pageCount = Math.ceil(filteredProducts.length / rowsPerPage);

        pages.push(1); // Toujours afficher la première page

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(pageCount - 1, currentPage + 1);

        if (currentPage > 2) {
            pages.push("..."); // Afficher les ellipses si nécessaire
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < pageCount - 2) {
            pages.push("..."); // Afficher les ellipses si nécessaire
        }

        if (pageCount > 1) {
            pages.push(pageCount); // Toujours afficher la dernière page
        }

        return pages;
    };

    // Calculer le nombre total de pages
    const pageCount = Math.ceil(filteredProducts.length / rowsPerPage);

    // Changer la page
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleWarehouseChange = async (event) => {
        const warehouseId = event.target.value;
        setSelectedWarehouseId(warehouseId);

        // Exécutez fetchProductsByWarehouse uniquement si warehouseId est non vide
        if (warehouseId) {
            await fetchProductsByWarehouse(warehouseId);
        } else {
            // Si aucun entrepôt n'est sélectionné, réinitialisez les produits
            setProducts([]);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="p-4 mb-16">
            <div className="my-4">
                <h2 className="text-lg font-bold">Equipe : {userTeamName}</h2>
                {selectedWarehouseId && <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center mt-2"
                onClick={handleOpenModal}
            >
                <FaHistory className="mr-2" /> Historique
            </button>}
            </div>
            <select 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedWarehouseId}
                onChange={handleWarehouseChange}
            >
                <option value="">Sélectionnez un entrepôt</option>
                {filteredWarehouses.map(warehouse => (
                    <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Rechercher par dénomination ou référence..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4 mb-4"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="mt-4">
            <table className="w-full table-auto table-fixed">
                <thead className="bg-gray-200">
                    <tr>
                        <th style={{ width: '60%' }} className="py-2">Dénomination</th>
                        <th style={{ width: '30%' }} className="py-2">Référence</th>
                        <th style={{ width: '10%' }} className="py-2">Qté</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTableData.map(product => (
                    <tr key={product._id} className="h-12 border-b border-gray-900">
                        <td style={{ width: '60%' }} className="px-4 py-2 overflow-auto">
                            <div className="h-10">{product.denomination}</div>
                        </td>
                        <td style={{ width: '30%' }} className="px-4 py-2 overflow-auto">
                            <div className="h-10">{product.reference}</div>
                        </td>
                        <td style={{ width: '10%' }} className="px-4 py-2 overflow-auto">
                            <div className="h-10">{product.quantity}</div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {selectedWarehouseId && paginationNumbers().map(pageNumber => {
                    if (pageNumber === "...") {
                        return <span className="px- py-2">...</span>;
                    }
                    
                    return (
                        <button
                        key={pageNumber}
                        onClick={() => pageNumber !== "..." && setCurrentPage(pageNumber)}
                        className={`px-4 py-2 border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>
            { selectedWarehouseId && <BottomMenu userTeam={userTeamId} selectedWarehouse={selectedWarehouseId} products={products} onProductAdded={handleProductAdded}/>}
            { showModal && <StockHistoryModal onClose={handleCloseModal} userTeam={userTeamId} userWarehouse={selectedWarehouseId}/>}
        </div>


);
};

export default WarehouseProductList;
