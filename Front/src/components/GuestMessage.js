import React from 'react';
import { FaUserLock } from 'react-icons/fa'; // Import de FaUserLock

const GuestMessage = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 mb-24 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      {/* Flex container pour disposition en colonne ou en ligne */}
      <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4 text-center">
        {/* Div contenant le texte avec une bordure à droite pour la séparation */}
        <div className="md:w-1/2 p-4 flex border-b md:border-b-0 md:border-r border-gray-300 justify-center items-center">
          <FaUserLock className="text-yellow-500" size="5em" />
        </div>
        {/* Div contenant l'icône avec arrière-plan */}
        <div className="md:w-1/2 p-4 flex justify-center items-center">
          <p className="text-gray-700">
            Malheureusement, votre compte n'a pas encore été certifié veuillez patienter. Vous pouvez contacter un administrateur pour toutes demandes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestMessage;