import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3001/login', { email, password });
      onLogin(response.data.token);
    } catch (error) {
      console.error(error);
      alert('Falha ao fazer login.', response.data.token);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" />
      </div>
      <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">Logar</button>
    </form>
  );
}

export default LoginForm;