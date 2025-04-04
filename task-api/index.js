const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

//JWT authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Tasks = db.Tasks;
const Users = db.User;

const app = express();
const port = process.env.PORT || 3001;
const secretKey = 'yourSecretKey';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token recebido:', token); // Adicione este log
  console.log('Chave secreta:', secretKey); // Adicione este log

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('Erro ao verificar token:', err);
      return res.sendStatus(403);
    }
    console.log('Usuário verificado:', user); // Adicione este log
    req.user = user;
    next();
  });
};

//rota para autenticação
//registrar
app.post('/register', async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//login
app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    console.log('Senha fornecida:', req.body.password);
    console.log('Senha armazenada:', user.password);
    if (!user.validPassword(req.body.password)) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Verificar conexão com o banco ANTES das rotas
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco estabelecida com sucesso.');
    
    // Sincronizar modelos (não força recriação)
    return db.sequelize.sync();
  })
  .then(() => {
    // task create
    app.post('/tasks', authenticateToken, async (req, res) => {
      try {
        const task = await db.Task.create(req.body); 
        res.json(task);
      } catch (error) {
        console.error('Erro ao criar task:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // list task
    app.get('/tasks', authenticateToken, async (req, res) => {
      try {
        const tasks = await db.Task.findAll(); 
        const formattedTasks = tasks.map(task => ({
          ...task.toJSON(),
          createdAt: new Date(task.createdAt).toLocaleString(),
          updatedAt: new Date(task.updatedAt).toLocaleString()
        }));
        res.json(formattedTasks);
      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        res.status(500).json({ error: error.message });
        res.json({ message: 'Tarefa atualizada' });
      }
    });

    // task edit
    app.put('/tasks/:id', authenticateToken, async (req, res) => {
      try {
        await db.Task.update(req.body, { where: { id: req.params.id } }); 
        res.json({ message: 'Tarefa atualizada' });
      } catch (error) {
        console.error('Erro ao atualizar task:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // task delete
    app.delete('/tasks/:id', authenticateToken, async (req, res) => {
      try {
        await db.Task.destroy({ where: { id: req.params.id } }); 
        res.json({ message: 'Tarefa excluída' });
      } catch (error) {
        console.error('Erro ao deletar task:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // task done
    app.patch('/tasks/:id/done', authenticateToken, async (req, res) => {
      try {
        await db.Task.update({ done: true }, { where: { id: req.params.id } }); 
        res.json({ message: 'Tarefa marcada como concluída' });
      } catch (error) {
        console.error('Erro ao marcar task como concluída:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch(err => {
    console.error('Falha ao conectar ao banco:', err);
    process.exit(1);
  });