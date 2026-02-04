import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PasswordForm from './PasswordForm';
import PasswordDetail from './PasswordDetail';

const PasswordList = () => {
    const [passwords, setPasswords] = useState([]);
    const [selectedPassword, setSelectedPassword] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPasswords();
    }, []);

    
const fetchPasswords = async () => {
    try {
        const response = await api.get('');
        setPasswords(response.data);
    } catch (error) {
        console.error('Erro ao buscar senhas:', error);
        if (error.response?.status === 403) {
            alert('Sessão expirada ou acesso negado. Faça login novamente.');
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.reload();
            }, 100);
        }
    }
};



const handleAddPassword = async (password) => {
    try {
        await api.post('', password); 
        fetchPasswords();
        setShowForm(false);
    } catch (error) {
        console.error('Erro ao adicionar senha:', error);
    }
};

const handleUpdatePassword = async (id, password) => {
    try {
        await api.put(`/${id}`, password); 
        fetchPasswords();
        setSelectedPassword(null);
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
    }
};

const handleDeletePassword = async (id) => {
    try {
        await api.delete(`/${id}`);
        fetchPasswords();
    } catch (error) {
        console.error('Erro ao excluir senha:', error);
    }
};

    return (
        <div>
            <h1>Pass Hub</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancelar' : 'Adicionar Senha'}
            </button>

            {showForm && (
                <PasswordForm
                    onSubmit={handleAddPassword}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {selectedPassword && (
                <PasswordDetail
                    password={selectedPassword}
                    onUpdate={handleUpdatePassword}
                    onCancel={() => setSelectedPassword(null)}
                />
            )}

            <ul>
                {passwords.map((password) => (
                    <li key={password.id}>
                        <strong>{password.serviceName}</strong> {password.username}
                        <button onClick={() => setSelectedPassword(password)}>Editar</button>
                        <button onClick={() => handleDeletePassword(password.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PasswordList;