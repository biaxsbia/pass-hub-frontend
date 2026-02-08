import React, { useState, useEffect } from 'react';
import PasswordList from './components/PasswordList';
import Login from './components/Login';
import Register from './components/Register';
import api from './services/api';
import './styles.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('')
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggedIn(false);
  };

  if (loading) return <p>Carregando...</p>;

if (loggedIn) {
  return (
    <div className="App">
      <div className="logout-button">
        <button onClick={handleLogout} className="button-primary">
          Sair
        </button>
      </div>
      <PasswordList />
    </div>
  );
}


  return (
    <div className="App">
      {showRegister ? (
        <>
          <Register />
          <button onClick={() => setShowRegister(false)} style={{ marginTop: 20 }}>
            Já tem conta? Fazer login
          </button>
        </>
      ) : (
        <>
          <Login onLoginSuccess={() => setLoggedIn(true)} />
          <button onClick={() => setShowRegister(true)} style={{ marginTop: 20 }}>
            Criar nova conta
          </button>
        </>
      )}
    </div>
  );
}

export default App;
