import React from 'react';
import { FaUser } from 'react-icons/fa'; // Ensure react-icons is installed

const CrmProductResumePopUpLeftInfo = ({ customer }) => {
    if (!customer) return null;

        const calculateAge = (birthday) => {
            if (birthday === "1900-12-31T23:50:39.000Z")
                return 'Inconnu';
            const birthDate = new Date(birthday);
            const currentDate = new Date();
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = currentDate.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age + " ans (" + birthDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ")";
        };
        return (
            <div className="flex flex-col items-center p-4">
                <FaUser className='size-16 my-4'/>
                <div className="flex flex-row text-center text-lg">
                    <div className="flex flex-col items-start">
                        <small className='text-gray-500 text-nowrap'>Prestashop Id :</small>
                        <small className='text-gray-500 text-nowrap'>Nom :</small>
                        <small className='text-gray-500 text-nowrap'>Prénom :</small>
                        <small className='text-gray-500 text-nowrap'>Titre de civilité :</small>
                        <small className='text-gray-500 text-nowrap'>E-mail :</small>
                        <small className='text-gray-500 text-nowrap'>Téléphone :</small>
                        <small className='text-gray-500 text-nowrap'>Âge :</small>
                        <small className='text-gray-500 text-nowrap'>Commandes :</small>
                    </div>
                    <div className="flex flex-col items-start mx-4">
                        <p className='text-nowrap'>{customer && (customer.prestashopId || 'Inconnu')}</p>
                        <p className='text-nowrap'>{customer && (customer.lastName || 'Inconnu')}</p>
                        <p className='text-nowrap'>{customer && (customer.firstName || 'Inconnu')}</p>
                        <p className='text-nowrap'>
                            {customer && customer.gender === 1 ? 'M.' : customer && customer.gender === 2 ? 'Mme.' : customer && customer.gender === 3 ? 'Mlle.' : 'Inconnu'}
                        </p>
                        <p className='text-nowrap'>{customer && (customer.email || 'Inconnu')}</p>
                        <p className='text-nowrap'>{customer && (customer.phone || 'Inconnu')}</p>
                        <p className='text-nowrap'>{customer && (calculateAge(customer.birthday))}</p>
                        <p className='text-nowrap'>{customer && (customer.orders.length || 'Inconnu')}</p>
                    </div>
                </div>
            </div>
        );
    };
export default CrmProductResumePopUpLeftInfo;