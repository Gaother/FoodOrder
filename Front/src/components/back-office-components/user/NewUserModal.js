// Modal.js
import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-1/4 mx-auto w-11/12 md:max-w-md lg:max-w-lg shadow-lg rounded-md bg-white">
      <div className="bg-blue-500 w-full h-12 rounded-t-md">
        <div className="mx-auto flex items-center justify-between p-2">
          <h3 className="text-lg leading-6 font-medium text-white ml-2">Créer un nouvel objet</h3>
          <button onClick={onClose} className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center mr-1" aria-label="close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-5 pt-0">
        <div className="mt-3 text-center">
          <div className="mt-2 px-7 py-3 flex flex-col space-y-4">
            {children}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Modal;
