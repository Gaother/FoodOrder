import React from 'react';
import { FaCheckCircle, FaBell, FaTimesCircle, FaShoppingCart, FaUserAlt, FaInbox, FaArchive } from 'react-icons/fa';

const Notifications = ({ notifications, markAsRead, type }) => {
  const handleMarkAsRead = (id) => {
    markAsRead([id]);
  };

  // Messages et icônes par type de notification
  const emptyState = {
    order: {
      icon: <FaShoppingCart className="text-blue-500" size={48} />,
      message: "Aucune notification de commande pour le moment.",
    },
    user: {
      icon: <FaUserAlt className="text-green-500" size={48} />,
      message: "Aucune notification d'utilisateur pour le moment.",
    },
    message: {
      icon: <FaInbox className="text-gray-500" size={48} />,
      message: "Aucun message pour le moment.",
    },
  };

  const { icon, message } = emptyState[type] || {};

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options).replace(',', ' à').replace(':', 'h');
  };

  return (
    <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4 p-6">
          {icon}
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 flex items-center justify-between rounded-lg transition ${
                n.notificationIsRead
                  ? 'bg-gray-100 border-l-4 border-gray-400'
                  : 'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex items-center">
                {/* Icône de notification */}
                <FaBell className={`mr-3 ${n.notificationIsRead ? 'text-gray-400' : 'text-blue-500'}`} size={24} />
                <span className="text-sm font-medium text-gray-700">
                  {formatDate(n.notification.createdAt)}
                  <br/>
                  {n.notification.content}
                </span>
              </div>
              {!n.notificationIsRead ? (
                <button
                  className="pl-2 relative group flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                  onClick={() => handleMarkAsRead(n._id)}
                  aria-label="Marquer comme lu"
                >
                  <FaArchive size={18} />
                  <span className="absolute right-8 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Marquer comme lu
                  </span>
                </button>
              ) : (
                <span className="pl-2 text-gray-500 flex items-center gap-2">
                  <FaTimesCircle size={18} />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;