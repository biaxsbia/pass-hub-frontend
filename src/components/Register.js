import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpUrl, setOtpUrl] = useState(null);
  const [totpSecret, setTotpSecret] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    return (
      password.length >= minLength &&
      hasLetter &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const isPasswordValid = validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setOtpUrl(null);

    if (!isPasswordValid) {
      setError(
        "A senha deve conter pelo menos 6 caracteres, incluindo letras, números e um caractere especial."
      );
      return;
    }

    if (!doPasswordsMatch) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
      });

      const data = response.data;
      setSuccess("Usuário registrado com sucesso!");
      setOtpUrl(data.otpAuthUrl);
      setTotpSecret(data.totpSecret);
    } catch (err) {
      setError(err.response?.data || "Erro ao registrar");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(totpSecret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Senha:</label><br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isPasswordValid && password && (
            <p style={{ color: "red", fontSize: "0.9em" }}>
              A senha deve ter pelo menos 6 caracteres, letras, números e um caractere especial.
            </p>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Confirmar Senha:</label><br />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && !doPasswordsMatch && (
            <p style={{ color: "red", fontSize: "0.9em" }}>
              As senhas não coincidem.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isPasswordValid || !doPasswordsMatch}
          style={{
            marginTop: 15,
            backgroundColor: !isPasswordValid || !doPasswordsMatch ? "#ccc" : "#4CAF50",
            color: "white",
            cursor: !isPasswordValid || !doPasswordsMatch ? "not-allowed" : "pointer",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Registrar
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      {success && (
        <div style={{ color: "green", marginTop: 10 }}>
          <p>{success}</p>
          <p>
            Para ativar sua autenticação em dois fatores, escaneie o QR Code abaixo com o Google Authenticator.
            <br />
            Quando terminar, clique em <a href="/login">"Fazer login"</a>
          </p>
        </div>
      )}

      {otpUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Escaneie o QR Code no Google Authenticator:</h3>
          <QRCodeSVG value={otpUrl} size={200} />
          <p style={{ marginTop: 10 }}>
            <strong>Código manual (caso necessário):</strong>
          </p>
          <code>{totpSecret}</code>
          <br />
          <button onClick={handleCopy} style={{ marginTop: 5 }}>
            Copiar código
          </button>
          {copied && <span style={{ color: "green", marginLeft: 10 }}>Copiado!</span>}
        </div>
      )}
    </div>
  );
}
