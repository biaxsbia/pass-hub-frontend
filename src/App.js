import React, { useState, useEffect } from 'react';
import PasswordList from './components/PasswordList';
import Login from './components/Login';
import Register from './components/Register';
import './styles.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);


const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  if (loggedIn) {
  return (
    <div className="App">
      <button onClick={handleLogout} style={{ position: 'absolute', top: 10, right: 10 }}>
        Sair
      </button>
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
