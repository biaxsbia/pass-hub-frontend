import React, { useState } from 'react';

const PasswordForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState(
        initialData || {
            serviceName: '',
            username: '',
            email: '',
            encryptedPassword: '',
            notes: '',
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Serviço:</label>
                <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Usuário:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    name="encryptedPassword"
                    value={formData.encryptedPassword}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Notas:</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onCancel}>
                Cancelar
            </button>
        </form>
    );
};

export default PasswordForm;