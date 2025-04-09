import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3001/register', { email, password });
      onRegister();
      setErrorMessage('Usuário registrado com sucesso!');
    } catch (error) {
      console.error(error);
      setErrorMessage('Falha ao registrar usuário.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" />
        </div>
        <button type="submit" className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Registrar</button>
      </form>
      
      {errorMessage && (
        <div className="my-5 bg-gray-200 p-4 rounded-md transition duration-700 text-black ">
          {errorMessage}
        </div>
      )}
    </div>

    
  );
}

export default RegisterForm;