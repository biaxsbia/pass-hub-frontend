import React, { useEffect, useState } from "react";
import api from "../services/api";
import PasswordForm from "./PasswordForm";

const PasswordDetail = ({ password, onUpdate, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [detailedPassword, setDetailedPassword] = useState(password);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (password && password.id) {
      setLoading(true);
      api
        .get(`/${password.id}`)
        .then((res) => setDetailedPassword(res.data))
        .catch((err) =>
          console.error("Erro ao buscar detalhes da senha:", err)
        )
        .finally(() => setLoading(false));
    }
  }, [password]);

  const handleUpdate = (updatedPassword) => {
    onUpdate(detailedPassword.id, {
      ...updatedPassword,
      encryptedPassword: updatedPassword.password
    });
    setIsEditing(false);
  };

  if (loading || !detailedPassword) {
    return <p className="muted-text">Carregando...</p>;
  }

  return (
    <div className="card">
      {isEditing ? (
        <>
          <h2 className="card-title">Editar senha</h2>

          <PasswordForm
            initialData={{
              ...detailedPassword,
              password: detailedPassword.encryptedPassword
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />

          <div className="actions">
            <button
              className="button-secondary"
              onClick={onCancel}
            >
              Voltar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="card-header">
            <h2>{detailedPassword.serviceName}</h2>
          </div>

          <div className="card-content">
            <div className="field">
              <span className="label">Usuário</span>
              <span className="value">{detailedPassword.username}</span>
            </div>

            <div className="field">
              <span className="label">Email</span>
              <span className="value">{detailedPassword.email}</span>
            </div>

            <div className="field password-field">
              <span className="label">Senha</span>
              <span className="value password-value">
                {detailedPassword.encryptedPassword}
              </span>
            </div>

            {detailedPassword.notes && (
              <div className="field">
                <span className="label">Notas</span>
                <span className="value">{detailedPassword.notes}</span>
              </div>
            )}
          </div>

          <div className="actions">
            <button
              className="button-primary"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>

            <button
              className="button-secondary"
              onClick={onCancel}
            >
              Voltar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordDetail;
