const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// task create
app.post('/tasks', async (req, res) => {
  try {
    const task = await Tasks.create(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// list task
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Tasks.findAll();
    const formattedTasks = tasks.map(task => ({
      ...task.toJSON(),
      createdAt: new Date(task.createdAt).toLocaleString(),
      updatedAt: new Date(task.updatedAt).toLocaleString()
    }));
    res.json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// task edit
app.put('/tasks/:id', async (req, res) => {
  try {
    await Tasks.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Tarefa atualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// task delete
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Tasks.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Tarefa excluída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// task done
app.patch('/tasks/:id/done', async (req, res) => {
  try {
    await Tasks.update({ done: true }, { where: { id: req.params.id } });
    res.json({ message: 'Tarefa marcada como concluída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} http://127.0.0.1:3001/tasks`);
});