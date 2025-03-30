// SendSMSForm.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const SendSMSForm = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [smsText, setSmsText] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const parsedPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
        const sms = {
            phoneNumber: parsedPhoneNumber,
            text: smsText,
        };

        try {
            const response = await api.createSMS(sms);
            if (response.status === 201) {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    resetFormFields();
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du SMS', error);
        }
    };

    const resetFormFields = () => {
        setPhoneNumber('');
        setSmsText('');
    };

    return (
        <div className="container mx-auto p-4 min-h-screen">
            {showSuccessMessage && (
                <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    Le SMS a bien été envoyé.
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Envoyer un SMS</h1>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                    <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                           className="p-2 block w-full rounded-md border-slate-500 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="smsText" className="block text-sm font-medium text-gray-700">Texte du SMS</label>
                    <textarea id="smsText" value={smsText} onChange={(e) => setSmsText(e.target.value)}
                              className="p-2 block w-full rounded-md border-slate-500 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                </div>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default SendSMSForm;