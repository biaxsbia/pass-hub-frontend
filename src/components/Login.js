import React, { useState } from "react";

export default function Login({ onLoginSuccess }) { 
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = step === 1 
      ? { email, password } 
      : { email, password, totp };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.status === 206) {
        setStep(2);
        setLoading(false);
      } else if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        setSuccessMessage("Login bem-sucedido!");
      } else {
        const errMsg = await response.text();
        setError(errMsg);
      }
    } catch (err) {
      setError("Erro na conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {step >= 1 && (
          <>
            <div>
              <label>Email:</label><br />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Senha:</label><br />
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
          <div>
            <label>Código 2FA (TOTP):</label><br />
            <input
              type="text"
              required
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              title="Informe o código TOTP de 6 dígitos"
            />
          </div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Aguarde..." : step === 1 ? "Avançar" : "Entrar"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      {successMessage && <p style={{ color: "green", marginTop: 10 }}>{successMessage}</p>}
    </div>
  );
}