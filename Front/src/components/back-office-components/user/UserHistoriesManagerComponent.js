import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const UserHistoryComponent = () => {
    const [userHistories, setUserHistories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUserHistories();
    }, []);

    const fetchUserHistories = async () => {
        try {
            const response = await api.getAllUserHistories();
            setUserHistories(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des utilisateurs:', error);
        }
    };

    // Filter the user histories based on the search term
    const filteredUserHistories = userHistories.filter((history) =>
        `${history.userId.lastName} ${history.userId.firstName} ${history.userId.companyName} ${history.userId.email} ${history.userId.phone} ${history.userCommand} ${history.userCommandData}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="bg-white flex flex-row items-center justify-between w-full border-b-2 mb-4 p-4">
                <h1 className="text-2xl font-bold text-gray-800">Historique des utilisateurs</h1>
            </div>

            {/* Search bar */}
            <div className="relative w-full mb-4">
                <input
                    type="text"
                    placeholder="Rechercher par nom, prénom, ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 w-full pl-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            {filteredUserHistories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
                    <p className="text-gray-500 text-xl">Aucun historique utilisateur trouvé</p>
                </div>
            ) : (
                <div className="overflow-auto pb-4">
                    <table className="min-w-full">
                        <thead className="sticky top-0 bg-white">
                            <tr className="bg-gray-200">
                                <th className="w-1/6 px-4 py-2">Nom</th>
                                <th className="w-1/6 px-4 py-2">Prénom</th>
                                <th className="w-1/6 px-4 py-2">Entreprise</th>
                                <th className="w-1/6 px-4 py-2">Email</th>
                                <th className="w-1/6 px-4 py-2">Téléphone</th>
                                <th className="w-1/6 px-4 py-2">Commande</th>
                                <th className="w-1/6 px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUserHistories.map((history) => (
                                <tr key={history._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{history.userId.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{history.userId.firstName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{history.userId.companyName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{history.userId.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{history.userId.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <span>{history.userCommand}</span>
                                        {history.userCommandData && (
                                            <div className="text-gray-500 text-md mt-1 max-w-96 overflow-x-auto">
                                                {history.userCommandData}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {history.createdAt ? new Date(history.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                                        <br />
                                        {history.createdAt ? new Date(history.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default UserHistoryComponent;