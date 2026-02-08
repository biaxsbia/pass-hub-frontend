import React, { useState } from "react";
import Header from "./Header";


export default function Login({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload =
      step === 1 ? { email, password } : { email, password, totp };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.status === 206) {
        setStep(2);
      } else if (response.ok) {
        onLoginSuccess?.();
      } else {
        setError(await response.text());
      }
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <div className="card-header">
<Header />
</div>
      <h2>{step === 1 ? "Entrar" : "Autenticação em dois fatores"}</h2>
      <p className="text-muted">
        {step === 1
          ? "Digite suas credenciais"
          : "Digite o código do seu aplicativo autenticador"}
      </p>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="form-group">
            <label>Código 2FA</label>
            <input
              type="text"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>
        )}

        <button disabled={loading}>
          {loading ? "Aguarde..." : step === 1 ? "Avançar" : "Entrar"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}
