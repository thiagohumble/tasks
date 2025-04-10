import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3001/login', { email, password });
      
      if (response.data && response.data.token) {
        onLogin(response.data.token);
        window.location.reload();
      } else {
        setErrorMessage('Resposta inesperada do servidor');
      }
      
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Credenciais inválidas');
      } else if (error.request) {
        setErrorMessage('Servidor não respondeu');
      } else {
        setErrorMessage('Erro ao tentar conectar');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" 
            required
          />
        </div>
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
          Logar
        </button>
      </form>

      {errorMessage && (
        <div className="my-5 bg-gray-200 p-4 rounded-md transition duration-700 text-black">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default LoginForm;