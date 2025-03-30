import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import api from '../../api/api';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Importez les styles CSS

const CreateSupportTicketForm = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [commentary, setCommentary] = useState('');
    const [assignedTagList, setAssignedTagList] = useState([]);
    const [tags, setTags] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchTags = async () => {
            const response = await api.getAllSupportTag();
            setTags(response.data || []);
        };
        if (isLoggedIn) {
            fetchTags();
        }
    }, [isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Sanitize the HTML from the editor
        const cleanCommentary = DOMPurify.sanitize(commentary);

        const ticket = {
            subject,
            commentary: cleanCommentary,
            assignedTagList,
            image: [],
        };

        try {
            const response = await api.createSupportTicket(ticket);
            if (response.status === 201) {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    resetFormFields();
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur lors de la création du ticket', error);
        }
    };

    const resetFormFields = () => {
        setSubject('');
        setCommentary('');
        setAssignedTagList([]);
    };

    return (
        <div className="container mx-auto p-4 min-h-screen">
            {showSuccessMessage && (
                <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    Le ticket a bien été envoyé.
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Créer un ticket de support</h1>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
                    <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                           className="p-2 block w-full rounded-md border-slate-500 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="commentary" className="block text-sm font-medium text-gray-700">Commentaire</label>
                    <ReactQuill className="h-40 mb-10" theme="snow" value={commentary} onChange={setCommentary} />
                </div>
                <div>
                    <label htmlFor="assignedTagList" className="block text-sm font-medium text-gray-700">Tags Assignés</label>
                    <select multiple={true} value={assignedTagList} onChange={(e) => setAssignedTagList([...e.target.selectedOptions].map(option => option.value))}
                            className="h-52 pb-2 mt-1 block w-full rounded-md border-slate-500 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        {tags.map((tag) => (
                            <option key={tag._id} value={tag._id}>{tag.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default CreateSupportTicketForm;
