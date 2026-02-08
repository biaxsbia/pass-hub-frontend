import React, { useState } from "react";

export default function PasswordForm({ onSubmit, onCancel, initialData }) {
  const [data, setData] = useState(
    initialData || {
      serviceName: "",
      username: "",
      email: "",
      encryptedPassword: "",
      notes: "",
    }
  );

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <h2>{initialData ? "Editar Senha" : "Nova Senha"}</h2>

      {["serviceName", "username", "email", "encryptedPassword"].map((field) => (
        <div className="form-group" key={field}>
          <label>{field}</label>
          <input
            name={field}
            value={data[field]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="form-group">
        <label>Notas</label>
        <textarea name="notes" value={data.notes} onChange={handleChange} />
      </div>

      <div className="actions">
        <button type="submit">Salvar</button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
