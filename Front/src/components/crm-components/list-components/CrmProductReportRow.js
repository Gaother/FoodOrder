import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import CrmProductResumePopUp from './CrmCustomerResumePopUp';

const CustomerRow = ({ customer }) => {
    const [showGraphPopup, setShowGraphPopup] = useState(false);
    const [graphId, setGraphId] = useState(null);

    useEffect(() => {
        // console.log(customer);
    }, []);

    return (
        <tr key={customer._id} className="bg-white shadow-lg rounded w-full max-w-80vw lg:max-w-full">
            {/* OriginSite */}
            <td className="px-4 py-2 overflow-auto text-center">
                {customer.originSite?.name}
            </td>
            {/* PrestashopIds */}
            <td className="px-4 py-2 overflow-auto text-center">
                {customer.prestashopId}
            </td>
            {/* Last Order */}
            <td className="px-4 py-2 overflow-auto text-left">
                {new Date(customer.dateLastOrder).toLocaleDateString('fr-FR')}
            </td>
            {/* Nom */}
            <td className="px-4 py-2 text-nowrap overflow-auto">
                {customer.lastName}
            </td>
            {/* Prenom */}
            <td className="px-4 py-2 text-nowrap overflow-auto">
                {customer.firstName}
            </td>
            {/* Email */}
            <td className="px-4 py-2 text-nowrap overflow-visible ">
                {customer.email}
            </td>
            {/* n° (Phone Number) */}
            <td className="px-4 py-2 text-nowrap overflow-auto text-right">
                {customer.phone}
            </td>
            {/* Action buttons */}
            <td className="px-4 py-2">
                <div className='flex flex-row justify-center gap-2'>
                    <button
                        onClick={() => {
                            setShowGraphPopup(true);
                            setGraphId(customer._id);
                        }}
                        className="inline-block p-0.5 rounded-full bg-green-500 hover:bg-green-700"
                    >
                        <FaInfoCircle className="text-white size-6" />
                    </button>
                </div>
                {showGraphPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-lg overflow-y-auto max-h-full relative">
                            <CrmProductResumePopUp customer={customer} graph_id={graphId} onClose={() => setShowGraphPopup(false)} />
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default CustomerRow;