import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [mensajePrivado, setMensajePrivado] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      obtenerDatosPrivados();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: username,
        password: password,
      });
      
      const accessToken = response.data.access;
      localStorage.setItem('access_token', accessToken);
      setToken(accessToken);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  const obtenerDatosPrivados = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/privado/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensajePrivado(response.data.mensaje);
    } catch (err) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setMensajePrivado('');
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>Iniciar Sesión (Comercio Electrónico)</h2>
        <p style={{ color: 'gray' }}>Acceso restringido. Inicia sesión para continuar.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Usuario (ej. admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            Ingresar
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', fontFamily: 'sans-serif', textAlign: 'center', border: '1px solid #ccc', padding: '30px', borderRadius: '8px' }}>
      <h1>Panel Privado de Comercio Electrónico</h1>
      <p style={{ color: 'green', fontWeight: 'bold', fontSize: '18px' }}>
        Respuesta del servidor Django: "{mensajePrivado}"
      </p>
      
      <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', wordBreak: 'break-all', fontSize: '12px', margin: '20px 0' }}>
        <strong>Token JWT activo en LocalStorage:</strong><br />
        {token}
      </div>

      <button 
        onClick={handleLogout} 
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
      >
        Cerrar Sesión (Eliminar Token)
      </button>
    </div>
  );
}

export default App;