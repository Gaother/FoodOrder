import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AuthContext } from '../../components/AuthContext'; 
import { FaUser, FaBuilding, FaBriefcase, FaEnvelope, FaLock, FaShoppingBag, FaNewspaper } from 'react-icons/fa'; 
import OrderList from '../../components/user-profile-components/OrderList'; // Composant pour lister les commandes
import Loading from '../../components/LoadingComponent';

import PushNotification from '../../service/Subscribe'; // Importez la fonction de notification push

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logOut } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    mailFeedSubscription: false,
    mailFeedMail: '',
    pushNotificationsIsSubscribe: false,
  });
  const [editableUserInfo, setEditableUserInfo] = useState(userInfo);
  const [isUpdated, setIsUpdated] = useState(false); // Pour gérer l'effet visuel après la mise à jour
  const [hasError, setHasError] = useState(false); // Pour gérer l'effet visuel en cas d'échec de la mise à jour
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.getUserInfo();
      const data = response.data;
      setUserInfo({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        password: '******',
        mailFeedSubscription: data.mailFeedSubscription ? data.mailFeedSubscription : false,
        mailFeedMail: data.mailFeedSubscription ? data.mailFeedMail : '',
        pushNotificationsIsSubscribe: data.pushNotificationsIsSubscribe ? data.pushNotificationsIsSubscribe : false,
      });
      setEditableUserInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: '',
        mailFeedSubscription: data.mailFeedSubscription ? data.mailFeedSubscription : false,
        mailFeedMail: data.mailFeedMail ? data.mailFeedMail : '',
        pushNotificationsIsSubscribe: data.pushNotificationsIsSubscribe ? data.pushNotificationsIsSubscribe : false,
      });
      setIsLoading(false);
      console.log("User Info:", userInfo);
      console.log("Editable User Info:", editableUserInfo);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditableUserInfo({ ...editableUserInfo, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEditableUserInfo({ ...editableUserInfo, [name]: checked });
  };

const handleEditProfile = async () => {
    const body = { ...editableUserInfo };
    if (body.password === '') {
        delete body.password; 
    }

    // Check if any required field is empty
    const requiredFields = ['firstName', 'lastName', 'email'];
    const emptyFields = requiredFields.filter(field => body[field] === '');
    if (emptyFields.length > 0) {
        console.error('Erreur: Veuillez remplir tous les champs obligatoires');
        setHasError(true);
        setTimeout(() => setHasError(false), 1000); // Réinitialiser après 1 seconde
        return;
    }

    try {
        await api.updateUser(userInfo._id, body);
        fetchUserInfo(); 
        setIsUpdated(true);
        setHasError(false);
        setTimeout(() => setIsUpdated(false), 1000); // Réinitialiser après 1 seconde
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        setHasError(true);
        setTimeout(() => setHasError(false), 1000); // Réinitialiser après 1 seconde
    }
};

  const handleLogout = async () => {
    try {
      await api.logout();
      logOut();
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center bg-[#FFFBF3]" style={{ minHeight: "84vh" }}>
            <div className="mb-4">
                <FaUser className="text-[#C60C30] text-6xl mx-auto" />
            </div>
            <Loading color='#C60C30'/>
        </div>
    );
}

  return (
    <div className='flex justify-center bg-[#FFFBF3]' style={{ minHeight: "83vh" }}>
      {/* Container with profile and orders */}
      <div className="container mx-auto p-4 md:my-8 bg-white shadow-lg md:rounded-lg flex flex-col md:flex-row max-w-5xl">
        
        {/* Left side: Profile Form */}
        <div className="flex-1 p-4">
          <div className="flex flex-col items-center">
            <div className="mb-4 bg-[#FFFBF3] border-2 border-[#948C1D] w-full py-10 flex items-center justify-center rounded-t-lg">
              <FaUser className="text-[#3C3333] h-16 w-16" />
            </div>
            <div className="w-full flex flex-col p-4">
                <div className="flex items-center border-b py-2">
                    <FaBriefcase className="text-gray-400 mr-2" />
                    <span className="p-1">Rôle: </span>
                    <span className="p-1 flex-grow">{userInfo.role}</span> {/* Le rôle est affiché, non modifiable */}
                </div>
              <div className="flex items-center border-b py-2">
                <FaUser className="text-gray-400 mr-2" />
                <span className="p-1">Prénom: </span>
                <input
                  type="text"
                  name="firstName"
                  value={editableUserInfo.firstName}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-1 flex-grow"
                />
              </div>
              <div className="flex items-center border-b py-2">
                <FaUser className="text-gray-400 mr-2" />
                <span className="p-1">Nom: </span>
                <input
                  type="text"
                  name="lastName"
                  value={editableUserInfo.lastName}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-1 flex-grow"
                />
              </div>
              <div className="flex items-center border-b py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="p-1">Email: </span>
                <input
                  type="email"
                  name="email"
                  value={editableUserInfo.email}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-1 flex-grow"
                />
              </div>
              <div className="flex items-center border-b py-2">
                <FaLock className="text-gray-400 mr-2" />
                <span className="p-1">Mot de passe: </span>
                <input
                  type="password"
                  name="password"
                  placeholder="******"
                  value={editableUserInfo.password}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-1 flex-grow"
                />
              </div>
             {/* <div className="flex items-center border-b py-2 justify-between">
                <div className='flex items-center'>
                  <FaNewspaper className="text-gray-400 mr-2" />
                  <span className="p-1">Abonné à la newsletter:</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="mailFeedSubscription"
                    checked={editableUserInfo.mailFeedSubscription}
                    onChange={handleCheckboxChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-yellow-500 transition-colors duration-300 ease-in-out"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-full"></div>
                </label>
              </div>*/}
              {/*<div className="flex items-center border-b py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="p-1">Email de la newsletter: </span>
                <input
                  type="email"
                  name="mailFeedMail"
                  value={editableUserInfo.mailFeedMail}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-1 flex-grow"
                />
              </div>*/}
              { userInfo.role === "superadmin" && <div className="flex items-center border-b py-2">
                <PushNotification checked={editableUserInfo.pushNotificationsIsSubscribe} user={userInfo}/>
              </div>}
            </div>
            <button
              onClick={handleEditProfile}
              className={`font-bold py-2 px-4 rounded w-full mt-4 border border-[#948C1D] ${
                isUpdated ? 'bg-[#3A8D35] text-white' 
                : hasError ? 'bg-[#C60C30] text-white' 
                : 'bg-[#FFFBF3] text-[#3C3333]'
              }`}
            >
              Mettre à jour le profil
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#FFFBF3] border border-[#948C1D] text-[#3C3333] font-bold py-2 px-4 rounded w-full mt-4"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="md:border-l-2 border-b-2 mx-4"></div>

        {/* Right side: Orders */}
        <div className="flex-1 p-4">
          <div className="flex items-center mb-4">
            <FaShoppingBag className="text-[#C60C30] text-2xl mr-2" />
            <h2 className="text-2xl font-bold">Vos commandes</h2>
          </div>
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;