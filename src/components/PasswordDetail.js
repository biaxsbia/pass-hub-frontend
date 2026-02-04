import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PasswordForm from './PasswordForm';

const PasswordDetail = ({ password, onUpdate, onCancel }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [detailedPassword, setDetailedPassword] = useState(password);

    useEffect(() => {
        if (password && password.id) {
            api.get(`/${password.id}`)
                .then(res => setDetailedPassword(res.data))
                .catch(err => console.error('Erro ao buscar detalhes da senha:', err));
        }
    }, [password]);

    const handleUpdate = (updatedPassword) => {
        onUpdate(detailedPassword.id, {
            ...updatedPassword,
            encryptedPassword: updatedPassword.password
        });
        setIsEditing(false);
    };

    if (!detailedPassword) return <p>Carregando...</p>;

    return (
        <div>
            {isEditing ? (
                <PasswordForm
                    initialData={{
                        ...detailedPassword,
                        password: detailedPassword.encryptedPassword
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div>
                    <h2>{detailedPassword.serviceName}</h2>
                    <p>Usuário: {detailedPassword.username}</p>
                    <p>Email: {detailedPassword.email}</p>
                    <p>Senha: {detailedPassword.encryptedPassword}</p>
                    <p>Notas: {detailedPassword.notes}</p>
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                    <button onClick={onCancel}>Voltar</button>
                </div>
            )}
        </div>
    );
};

export default PasswordDetail;
