import React, { useEffect, useState } from "react";
import api from "../services/api";
import PasswordForm from "./PasswordForm";
import PasswordDetail from "./PasswordDetail";
import Header from "./Header";



const PasswordList = () => {
  const [passwords, setPasswords] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const response = await api.get("");
      setPasswords(response.data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
      if (error.response?.status === 403) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.reload();
      }
    }
  };

  const handleAddPassword = async (password) => {
    try {
      await api.post("", password);
      fetchPasswords();
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao adicionar senha:", error);
    }
  };

  const handleUpdatePassword = async (id, password) => {
    try {
      await api.put(`/${id}`, password);
      fetchPasswords();
      setSelectedPassword(null);
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  };

  const handleDeletePassword = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta senha?")) return;

    try {
      await api.delete(`/${id}`);
      fetchPasswords();
    } catch (error) {
      console.error("Erro ao excluir senha:", error);
    }
  };

  if (selectedPassword) {
    return (
      <PasswordDetail
        password={selectedPassword}
        onUpdate={handleUpdatePassword}
        onCancel={() => setSelectedPassword(null)}
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header">
<Header />
        <button
          className="button-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "Adicionar senha"}
        </button>
      </div>

      {showForm && (
        <PasswordForm
          onSubmit={handleAddPassword}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ul className="password-list">
        {passwords.map((password) => (
<li
  className="password-item"
  onClick={() => setSelectedPassword(password)}
>
            <div className="password-info">
  <strong>{password.serviceName}</strong>
  <span>{password.username}</span>
</div>


            <div className="actions">
              <button
                className="button-danger"
                onClick={() => handleDeletePassword(password.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordList;
