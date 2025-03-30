import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import Modal from './NewUserModal';
import { FaTrash, FaPencilAlt, FaTimes, FaCheck, FaPlus, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const UserManagerComponent = ({ onUserCreated }) => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ lastName: '', firstName: '', companyName: '', email: '', phone:'', password: '', role: 'user' });
    const [editingIndex, setEditingIndex] = useState(-1); // -1 signifie qu'aucun utilisateur n'est en cours d'édition
    const [showModal, setShowModal] = useState(false);
    const [roles] = useState(['guest', 'viewer', 'certifiate', 'admin', 'superadmin']);
    const [searchTerm, setSearchTerm] = useState(''); // État pour gérer la recherche

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedUsers = [...users];
        updatedUsers[index] = { ...updatedUsers[index], [name]: value };
        setUsers(updatedUsers);
    };

    const handleNewUserChange = (event) => {
        const { name, value } = event.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const getAllUsers = async () => {
        try {
          const response = await api.getAllUsers();
          setUsers(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération de tous les utilisateurs:', error);
        }
    };

    const createUser = async () => {
        try {
          await api.register(newUser);
          setNewUser({ lastName: '', firstName: '', companyName: '', email: '', phone:'', password: '' });
          await getAllUsers();
          onUserCreated();
        } catch (error) {
          console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
    };

    const updateUser = async (userId, user) => {
        try {
          await api.updateUser(userId, user);
          await getAllUsers();
          onUserCreated();
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
          try {
              await api.deleteUser(userId);
              await getAllUsers();
              onUserCreated();
          } catch (error) {
              console.error('Erreur lors de la suppression de l\'utilisateur:', error);
          }
        }
    };

    // Filtrer les utilisateurs en fonction du terme de recherche
    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
          <div className="bg-white flex flex-row items-center justify-between w-full border-b-2 mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gérez vos utilisateurs ({users.length})</h1>
            </div>
            <div className=''>
              <button onClick={() => setShowModal(true)} className="rounded-md bg-green-500 hover:bg-green-600 p-4 m-4">
              <span className="text-white flex flex-row items-center md:text-nowrap"><FaPlus className='m-0 md:mr-2'/><span className='hidden md:block'>Ajouter un nouvel utilisateur</span></span>              </button>
            </div>
          </div>  
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <form onSubmit={(e) => { e.preventDefault(); createUser(); }} className="space-y-4">
                <div>
                  <input className="border-2 pl-1 border-white-100" type="text" name="lastName" value={newUser.lastName} onChange={handleNewUserChange} placeholder="Nom"/>
                </div>
                <div>
                  <input className="border-2 pl-1 border-white-100" type="text" name="firstName" value={newUser.firstName} onChange={handleNewUserChange} placeholder="Prénom"/>
                </div>
                <div>
                  <input className="border-2 pl-1 border-white-100" type="text" name="companyName" value={newUser.companyName} onChange={handleNewUserChange} placeholder="Société"/>
                </div>
                <div>
                  <input className="border-2 pl-1 border-white-100" type="email" name="email" value={newUser.email} onChange={handleNewUserChange} placeholder="Email"/>
                </div>
                <div>
                  <input className="border-2 pl-1 border-white-100" type="phone" name="phone" value={newUser.phone} onChange={handleNewUserChange} placeholder="Phone"/>
                </div>
                <div>
                  <input className="border-2 pl-1 border-white-100" type="password" name="password" value={newUser.password} onChange={handleNewUserChange} placeholder="Mot de passe"/>
                </div>
                <div className="whitespace-nowrap flex flex-col items-center pt-4">
                  <button type="submit" className="w-max py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center">Créer</button>
                </div>
              </form>
            </Modal>
          )}

              
              {users.length === 0 ? (
              // Afficher un message centré lorsque la liste des utilisateurs est vide
              <div className="flex flex-col items-center justify-center h-64">
                <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-500 text-xl">Aucun utilisateur</p>
              </div>
            ) : (
              <>
              {/* Barre de recherche */}
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 w-full pl-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
              </div>
              <div className="overflow-auto pb-4">
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className='bg-gray-200'>
                      <th className="w-1/8 px-4 py-2">Nom</th>
                      <th className="w-1/8 px-4 py-2">Prénom</th>
                      <th className="w-1/8 px-4 py-2">Société</th>
                      <th className="w-1/8 px-4 py-2">Email</th>
                      <th className="w-1/8 px-4 py-2">Phone</th>
                      <th className="w-1/8 px-4 py-2">MdP</th>
                      <th className="w-1/8 px-4 py-2">Role</th>
                      <th className="w-1/8 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user._id} className={`border-b ${editingIndex === index ? 'bg-gray-100 shadow-outline' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="text" value={user.lastName} name="lastName" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">{user.lastName}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="text" value={user.firstName} name="firstName" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">{user.firstName}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="text" value={user.companyName} name="companyName" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">{user.companyName}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="email" value={user.email} name="email" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">{user.email}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="phone" value={user.phone} name="phone" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">{user.phone}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="password" name="password" placeholder="New Password" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">••••••••</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <select name="role" value={user.role} onChange={(e) => handleInputChange(e, index)} className="form-select rounded-md shadow-sm mt-1 block w-full">
                              {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="block w-full">{user.role}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                          <div className="flex justify-center items-center">
                            {editingIndex === index ? (
                              <>
                                <button onClick={() => {
                                  updateUser(user._id, users[index]);
                                  setEditingIndex(-1);
                                }} className="text-green-600 hover:text-green-900 ">
                                  <FaCheck />
                                </button>
                                <button onClick={() => setEditingIndex(-1)} className="text-red-600 ml-3 hover:text-red-900">
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <button onClick={() => setEditingIndex(index)} className="text-indigo-600 hover:text-indigo-900">
                                <FaPencilAlt />
                              </button>
                            )}
                            <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-900 ml-3">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </>
      );      
};

export default UserManagerComponent;