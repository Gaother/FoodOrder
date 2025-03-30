import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../api/api';

function Subscribe({checked = false, user}) {
    const [message, setMessage] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(checked);

    useEffect(() => {
        setIsSubscribed(checked);
    }, [checked]);

    const subscribeUser = async (status) => {
        try {
            if (status == "false") {
                const response = await api.updateUser(user._id, {pushNotification: false});
                if (response.status === 200) {
                    setIsSubscribed(false);
                }
            } else if (status === "true") {

                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    setMessage('Permission not granted for Notification');
                    return;
                }
                const registration = await navigator.serviceWorker.register('../service-worker.js');
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('BH6Kn4hcDhq0fPY1eC5f40MF6gR2b6JIRhdl5rSCWRqZiRTJEqS3NisROYkPOeFiD_J2IKifjbsdb_Sz78IEcQo')
                });
                console.log('User is subscribed:', subscription);

                await api.subscribeUserToPushNotifications({ subscription: subscription });
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Failed to subscribe the user: ', error);
            setMessage('Failed to subscribe the user');
        }
    };

    const handleCheckboxChange = async () => {
        if (isSubscribed) {
            // Logic to unsubscribe the user
            setIsSubscribed(false);
            await subscribeUser("false");
        } else {
            await subscribeUser("true");
        }
    };
 
    return (
        <div className="flex items-center justify-between w-full">
            <div className='flex items-center'>
                <FaBell className="text-gray-400 mr-2" />
                <span className="p-1">Abonné aux notifications push:</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox"
                    name="isSubscribed"
                    checked={isSubscribed} 
                    onChange={handleCheckboxChange} 
                    className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-yellow-500 transition-colors duration-300 ease-in-out"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-full"></div>
            </label>
        </div>
    );
}

// Utility function to convert VAPID key to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export default Subscribe;