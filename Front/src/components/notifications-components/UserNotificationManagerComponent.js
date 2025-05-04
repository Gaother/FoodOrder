import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../AuthContext';
import { FaEnvelope, FaShoppingCart, FaUser, FaComment } from 'react-icons/fa';
import Notifications from './Notifications';
import api from '../../api/api';

const UserNotificationsManager = () => {
  const jwtToken = localStorage.getItem('JWToken');
  const { userNotification } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('order'); // Onglet actif par défaut
  const notificationRef = useRef(null);
  // Trier les notifications pour que les non lues soient en premier
  console.log(userNotification, "userNotification")
  const sortedNotifications = [...userNotification].sort((a, b) => {
    return a.notificationIsRead === b.notificationIsRead
      ? 0
      : a.notificationIsRead
      ? 1
      : -1;
  });

  useEffect(() => {
    if (!userNotification) return;
    setNotifications(userNotification || []);
    setNotifications(sortedNotifications || []);
  }, [userNotification]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationRef]);


  // Filtrer les notifications par type
  const orderNotifications = notifications.filter(
    (n) => n.notification.notificationType === 'order'
  );
  const messageNotifications = notifications.filter(
    (n) => n.notification.notificationType === 'message'
  );

  const hasUnreadOrderNotifications = orderNotifications.some(
    (n) => !n.notificationIsRead
  );
  const hasUnreadMessageNotifications = messageNotifications.some(
    (n) => !n.notificationIsRead
  );

  
  // Obtenir le nombre de notifications non lues pour chaque type
  const unreadOrderNotifications = orderNotifications.filter(
    (n) => !n.notificationIsRead
  );
  const unreadMessageNotifications = messageNotifications.filter(
    (n) => !n.notificationIsRead
  );
  
  // Vérifier s'il y a des notifications non lues globalement
  const hasUnreadNotifications =
    unreadOrderNotifications.length > 0 ||
    unreadMessageNotifications.length > 0;
  // Fonction pour marquer les notifications comme lues
  const markNotificationsAsRead = async (notificationIds) => {
    try {
      const response = await api.markNotificationsAsRead(notificationIds);
      if (response.status === 200) {
        // Mettre à jour l'état local des notifications
        setNotifications((prevNotifications) => {
          const updatedNotifications = prevNotifications.map((n) =>
            notificationIds.includes(n._id)
              ? { ...n, notificationIsRead: true }
              : n
          );
          return updatedNotifications.sort((a, b) => 
            a.notificationIsRead === b.notificationIsRead
              ? 0
              : a.notificationIsRead
              ? 1
              : -1
          );
        });
      } else {
        console.error('Échec lors de la mise à jour des notifications');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
    }
  };

  // Fonction pour basculer l'affichage des notifications
  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <div className="ml-4 flex p-0.5 items-center justify-center bg-yellow-500 text-white rounded-full h-12 w-12 hover:bg-yellow-600">
        <div className="relative flex flex-col">
          <div className="flex items-center" onClick={handleToggleNotifications}>
            <FaEnvelope
              className={`text-black p-2 h-10 w-10 cursor-pointer ${
                hasUnreadNotifications ? 'ml-5' : ''
              }`}
            />
            {hasUnreadNotifications && (
              <span className="relative bottom-3 right-3 h-5 w-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                {unreadOrderNotifications.length +
                  unreadMessageNotifications.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {showNotifications && (
        <div ref={notificationRef} className="absolute md:right-10 right-0 left-0 md:left-auto top-20 bg-white rounded-md shadow-lg border-2">
          <div className="flex justify-around border-b p-2">
            <button
              className={`relative px-4 py-2 ${
                activeTab === 'order' ? 'font-bold border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('order')}
            >
              <p className="hidden md:block text-lg text-black font-bold m-2 mx-4">Commandes</p>
              <FaShoppingCart className="block md:hidden text-blue-500 text-xl" />
              {unreadOrderNotifications.length > 0 && (
                <span className="absolute top-0 right-1 md:top-4 md:right-2 h-5 w-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {unreadOrderNotifications.length}
                </span>
              )}
            </button>
            <button
              className={`relative px-4 py-2 ${
                activeTab === 'message' ? 'font-bold border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('message')}
            >
              <p className="hidden md:block text-lg text-black font-bold m-2 mx-4">Messages</p>
              <FaComment className="block md:hidden text-purple-500 text-xl" />
              {unreadMessageNotifications.length > 0 && (
                <span className="absolute top-0 right-1 md:top-4 md:right-2 h-5 w-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {unreadMessageNotifications.length}
                </span>
              )}
            </button>
          </div>

          <div className="p-4 bg-[#f4f4f4] rounded-b-md">
            {activeTab === 'order' && (
              <Notifications
                notifications={orderNotifications}
                markAsRead={markNotificationsAsRead}
                type="order"
              />
            )}
            {activeTab === 'message' && (
              <Notifications
                notifications={messageNotifications}
                markAsRead={markNotificationsAsRead}
                type="message"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserNotificationsManager;