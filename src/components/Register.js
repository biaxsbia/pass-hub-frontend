import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpUrl, setOtpUrl] = useState(null);
  const [error, setError] = useState("");

  const valid =
    password.length >= 6 &&
    /\d/.test(password) &&
    /[^a-zA-Z0-9]/.test(password) &&
    password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
      });
      setOtpUrl(res.data.otpAuthUrl);
    } catch {
      setError("Erro ao registrar");
    }
  };

  return (
    <div className="App">
      <h2>Criar Conta</h2>

      {!otpUrl ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button disabled={!valid}>Registrar</button>
        </form>
      ) : (
        <div className="qr-container">
          <h3>Ative seu 2FA</h3>
          <QRCodeSVG value={otpUrl} size={200} />
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
