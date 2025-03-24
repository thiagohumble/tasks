const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Tasks } = require('./models');

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

// task list
app.get('/tasks', async (req, res) => {
  try {
    const task = await Tasks.findAll();
    res.json(task);
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
    await Tasks.update({ concluida: true }, { where: { id: req.params.id } });
    res.json({ message: 'Tarefa marcada como concluída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

