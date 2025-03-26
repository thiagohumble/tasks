const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

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
    // task create
    app.post('/tasks', async (req, res) => {
      try {
        const task = await db.Task.create(req.body); 
        res.json(task);
      } catch (error) {
        console.error('Erro ao criar task:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // list task
    app.get('/tasks', async (req, res) => {
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
      }
    });

    // task edit
    app.put('/tasks/:id', async (req, res) => {
      try {
        await db.Task.update(req.body, { where: { id: req.params.id } }); 
        res.json({ message: 'Tarefa atualizada' });
      } catch (error) {
        console.error('Erro ao atualizar task:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // task delete
    app.delete('/tasks/:id', async (req, res) => {
      try {
        await db.Task.destroy({ where: { id: req.params.id } }); 
        res.json({ message: 'Tarefa excluída' });
      } catch (error) {
        console.error('Erro ao deletar task:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // task done
    app.patch('/tasks/:id/done', async (req, res) => {
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