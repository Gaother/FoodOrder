import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Pagination = ({ onPageChange, initialPage = 1, totalPages, currentPage }) => {
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    const goToNextPage = () => {
        const nextPage = Math.min(page + 1, totalPages);
        setPage(nextPage);
        onPageChange(nextPage);
    };

    const goToPreviousPage = () => {
        const prevPage = Math.max(page - 1, 1);
        setPage(prevPage);
        onPageChange(prevPage);
    };

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Supprime tout ce qui n'est pas un chiffre
        value = Math.min(parseInt(value, 10), totalPages); // Limite la valeur à totalPages
        setPage(value ? value : '');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onPageChange(page ? parseInt(page, 10) : 1);
        }
    };

    return (
        <div className="flex justify-center items-center space-x-2 my-4">
            {page > 1 && (
                <button onClick={goToPreviousPage} className="p-2">
                    <FaArrowLeft />
                </button>
            )}
            <div className="flex items-center">
                <input
                    type="text"
                    value={page}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-12 text-center border-2 border-gray-300 rounded"
                />
                <span className="ml-2 whitespace-nowrap">/ {totalPages}</span>
            </div>
            {page < totalPages && (
                <button onClick={goToNextPage} className="p-2">
                    <FaArrowRight />
                </button>
            )}
        </div>
    );
};

export default Pagination;
