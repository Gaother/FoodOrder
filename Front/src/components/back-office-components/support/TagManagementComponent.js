import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import { FaTrash } from 'react-icons/fa';


const TagManagement = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [unassignedUsers, setUnassignedUsers] = useState([]);

    useEffect(() => {
        fetchTags();
        fetchUsers();
    }, []);

    const fetchTags = async () => {
        const response = await api.getAllSupportTag();
        setTags(response.data);
    };

    const fetchUsers = async () => {
        const response = await api.getAllUsers();
        setUsers(response.data);
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        await api.createSupportTag({ name: newTagName });
        setNewTagName('');
        fetchTags();
    };

    const handleSelectTag = (tag) => {
        setSelectedTag(tag);
        const assigned = tag.assignedUser.map(userId => users.find(user => user._id === userId));
        setAssignedUsers(assigned);
        const unassigned = users.filter(user => !tag.assignedUser.includes(user._id));
        setUnassignedUsers(unassigned);
    };

    const handleDeleteTag = async (tagId) => {
        if (!tagId) return;
    
        try {
            // Appel API pour supprimer le tag
            await api.deleteSupportTagById(tagId);
    
            // Rafraîchir la liste des tags après suppression
            const updatedTags = tags.filter(tag => tag._id !== tagId);
            setTags(updatedTags);
    
            // Si le tag supprimé était sélectionné, réinitialiser la sélection
            if (selectedTag && selectedTag._id === tagId) {
                setSelectedTag(null);
                setAssignedUsers([]);
                setUnassignedUsers(users);
            }
        } catch (error) {
            console.error("Failed to delete tag:", error);
        }
    };
    

    const handleAssignUser = async (userId) => {
        if (!selectedTag || !userId) return;
    
        // Calculer la nouvelle liste des IDs d'utilisateurs assignés
        const updatedAssignedUserIds = [...selectedTag.assignedUser, userId];
    
        try {
            // Envoyer la mise à jour à l'API
            await api.updateSupportTagById(selectedTag._id, { assignedUser: updatedAssignedUserIds });
    
            // Mettre à jour l'état local sans recharger toutes les données
            const updatedTags = tags.map(tag => {
                if (tag._id === selectedTag._id) {
                    return { ...tag, assignedUser: updatedAssignedUserIds };
                }
                return tag;
            });
            setTags(updatedTags);
            // Mettre à jour la sélection et les listes d'utilisateurs sans refetch complet
            handleSelectTag({ ...selectedTag, assignedUser: updatedAssignedUserIds });
        } catch (error) {
            console.error("Failed to assign user to tag:", error);
        }
    };
    

    const handleUnassignUser = async (userId) => {
        if (!selectedTag || !userId) return;
    
        // Calculer la nouvelle liste des IDs d'utilisateurs assignés
        const updatedAssignedUserIds = selectedTag.assignedUser.filter(id => id !== userId);
    
        try {
            // Envoyer la mise à jour à l'API
            await api.updateSupportTagById(selectedTag._id, { assignedUser: updatedAssignedUserIds });
    
            // Mettre à jour l'état local sans recharger toutes les données
            const updatedTags = tags.map(tag => {
                if (tag._id === selectedTag._id) {
                    return { ...tag, assignedUser: updatedAssignedUserIds };
                }
                return tag;
            });
            setTags(updatedTags);
            // Mettre à jour la sélection et les listes d'utilisateurs sans refetch complet
            handleSelectTag({ ...selectedTag, assignedUser: updatedAssignedUserIds });
        } catch (error) {
            console.error("Failed to unassign user from tag:", error);
        }
    };
    
    

    return (
        <div className="flex">
            <div className="w-1/3 p-4 bg-gray-50">
                <div className="mb-4">
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Nouveau tag"
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                    <button onClick={handleCreateTag} className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Créer Tag
                    </button>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Tags existants :</h3>
                    {tags.map((tag) => (
                        <div
                            onClick={() => handleSelectTag(tag)}
                            key={tag._id}
                            className={`cursor-pointer flex justify-between items-center p-2 rounded ${selectedTag && selectedTag._id === tag._id ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                        >
                            <div
                                className={`p-2`}
                            >
                                {tag.name}
                            </div>
                            <FaTrash
                                onClick={(e) => {
                                    e.stopPropagation(); // Empêche la propagation à l'élément parent
                                    handleDeleteTag(tag._id);
                                }}
                                className="cursor-pointer w-4 h-4 mx-2 text-red-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 p-4">
                <div className="flex justify-between space-x-4">
                    <div className="w-1/2">
                        <h3 className="font-semibold mb-2">Utilisateurs non assignés :</h3>
                        <div className="max-h-64 overflow-auto border border-gray-200 rounded">
                            {unassignedUsers.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => handleAssignUser(user._id)}
                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                >
                                    {user.username}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <h3 className="font-semibold mb-2">Utilisateurs assignés :</h3>
                        <div className="max-h-64 overflow-auto border border-gray-200 rounded">
                            {assignedUsers.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUnassignUser(user._id)}
                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                >
                                    {user.username}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );    
};

export default TagManagement;
