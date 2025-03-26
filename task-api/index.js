const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models'); // Importação CORRETA

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Verificar conexão com o banco ANTES das rotas
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco estabelecida com sucesso.');
    
    // Sincronizar modelos (não força recriação)
    return db.sequelize.sync();
  })
  .then(() => {

    
    // Rota GET /tasks - CORRIGIDA usando db.Task
    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await db.Task.findAll(); // Note db.Task
        const formattedTasks = tasks.map(task => ({
          ...task.toJSON(),
          createdAt: new Date(task.createdAt).toLocaleString(),
          updatedAt: new Date(task.updatedAt).toLocaleString()
        }));
        res.json(formattedTasks);
      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // task create
    app.post('/tasks', async (req, res) => {
      try {
        const task = await Task.create(req.body);
        res.json(task);
      } catch (error) {
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