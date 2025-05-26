import React, { useState } from 'react';
import Login from './login';
import Register from './register'; // si tu as un écran d'inscription

export default function AuthScreen() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? (
        <Register onLogin={() => setShowRegister(false)} />
      ) : (
        <Login onRegister={() => setShowRegister(true)} />
      )}
    </>
  );
}
