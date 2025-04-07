const jwt = require('jsonwebtoken');
require('dotenv').config();

// Chave secreta FIXA (deve ser a mesma para gerar e verificar)
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCDYzMTN9.tdntOEMWKeZKvJNEIwsfvqDRiCxYFShVi1ku_jE5rRwJ9.eyJpZCI6MywiaWF0IjoxNzQzNzgyNzEzLCJleHAiOjE3NDM3O';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' } // Tempo de expiração
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
};

module.exports = { generateToken, verifyToken, JWT_SECRET };