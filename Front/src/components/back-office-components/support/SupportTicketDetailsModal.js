import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import DOMPurify from 'dompurify';


const TicketDetailsModal = ({ ticket, onClose, refreshTickets }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Active l'animation d'entrée
        setIsVisible(true);
        // À l'ouverture de la modal, empêche le scroll du body
        document.body.style.overflow = 'hidden';
        return () => {
            // Réactive le scroll à la fermeture
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        // Active l'animation de sortie
        setIsVisible(false);
        // Attendre la fin de l'animation avant de fermer réellement la modal
        setTimeout(() => {
            onClose();
        }, 300); // Assurez-vous que cette durée correspond à la durée de votre animation CSS
    };

    const toggleTicketClosedState = async () => {
        const response = await api.updateSupportTicketById(ticket._id, { closed: ticket.closed ? false : true });
        refreshTickets();
        handleClose();
    };

    const cleanHTML = DOMPurify.sanitize(ticket.commentary);

    return (
        <div className={`mt-20 fixed right-0 top-0 w-1/2 h-full bg-white shadow-xl overflow-auto z-50 transform transition-all duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{ticket.subject}</h2>
                    <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <p><strong>Auteur:</strong> {ticket.author.username}</p>
                <div className='flex flex-col'><strong>Commentaire:</strong>
                    <div className='bg-gray-50 p-2 border-2 rounded-md' dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
                </div>
                <div>
                    <strong>Tags:</strong>
                    <div className="">
                        {ticket.assignedTagList.map(tag => (
                            <span key={tag._id} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 mr-2 my-2 rounded-full">{tag.name}</span>
                        ))}
                    </div>
                </div>
                
                <p><strong>État:</strong>
                    <span className={`ml-2 px-2 w-14 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.closed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {ticket.closed ? 'Fermé' : 'Ouvert'}
                </span></p>
                <p><strong>Date:</strong> {new Date(ticket.date).toLocaleString()}</p>
                <button onClick={toggleTicketClosedState} className={`mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${ticket.closed ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                    {ticket.closed ? 'Rouvrir' : 'Fermer'} le ticket
                </button>
            </div>
        </div>
    );
};

export default TicketDetailsModal;