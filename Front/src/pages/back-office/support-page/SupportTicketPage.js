import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import TicketDetailsModal from '../../../components/back-office-components/support/SupportTicketDetailsModal'; // À créer
import TagManagementComponent from '../../../components/back-office-components/support/TagManagementComponent'; // À créer

const SupportTicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        const response = await api.getAllSupportTicket();
        const sortedTickets = response.data.sort((a, b) => {
            if (a.closed === b.closed) {
                return new Date(b.date) - new Date(a.date);
            }
            return a.closed ? 1 : -1;
        });
        setTickets(sortedTickets);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className="flex">
            <div className="w-2/3 max-w-4xl mx-auto">
                <div className="max-w-4xl mx-auto">
                    <ul className="divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                        <li key={ticket._id} className="p-4 hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                            <div className="flex flex-col">
                                <span className="font-medium text-indigo-600">{ticket.subject}</span>
                                <span className={`px-2 my-1 w-14 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.closed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {ticket.closed ? 'Fermé' : 'Ouvert'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{ticket.commentary.substring(0, 100)}...</p>
                            <div className="mt-2">
                                {ticket.assignedTagList.map(tag => (
                                    <span key={tag._id} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 mr-2 rounded-full">{tag.name}</span>
                                ))}
                            </div>
                        </li>
                    ))}
                    </ul>
                    {selectedTicket && <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} refreshTickets={fetchTickets} />}
                </div>
            </div>
            <div className="w-1/3 p-4">
                <TagManagementComponent />
            </div>
        </div>
        
    );
};

export default SupportTicketList;
