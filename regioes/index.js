const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/geografia', { useNewUrlParser: true, useUnifiedTopology: true });

const Pais = mongoose.model('Pais', new mongoose.Schema({ nome: String }));
const Estado = mongoose.model('Estado', new mongoose.Schema({ nome: String, paisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais' } }));
const Cidade = mongoose.model('Cidade', new mongoose.Schema({ nome: String, estadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estado' } }));

app.post('/paises', async (req, res) => {
  const item = new Pais(req.body);
  await item.save();
  res.send(item);
});

app.get('/paises', async (req, res) => {
  const items = await Pais.find().populate('estados');
  res.send(items);
});

app.put('/paises/:id', async (req, res) => {
  const item = await Pais.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(item);
});

app.delete('/paises/:id', async (req, res) => {
  await Pais.findByIdAndDelete(req.params.id);
  res.send({ message: 'Removido com sucesso' });
});

app.post('/estados', async (req, res) => {
  const pais = await Pais.findById(req.body.paisId);
  const item = new Estado({ ...req.body, pais: pais });
  await item.save();
  pais.estados.push(item);
  await pais.save();
  res.send(item);
});

app.get('/estados', async (req, res) => {
  const items = await Estado.find().populate('pais');
  res.send(items);
});

app.put('/estados/:id', async (req, res) => {
  const item = await Estado.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(item);
});

app.delete('/estados/:id', async (req, res) => {
  const estado = await Estado.findById(req.params.id);
  await Estado.findByIdAndDelete(req.params.id);
  const pais = await Pais.findById(estado.pais);
  pais.estados.pull(estado);
  await pais.save();
  res.send({ message: 'Removido com sucesso' });
});

app.post('/cidades', async (req, res) => {
  const estado = await Estado.findById(req.body.estadoId);
  const item = new Cidade({ ...req.body, estado: estado });
  await item.save();
  estado.cidades.push(item);
  await estado.save();
  res.send(item);
});

app.get('/cidades', async (req, res) => {
  const items = await Cidade.find().populate('estado');
  res.send(items);
});

app.put('/cidades/:id', async (req, res) => {
  const item = await Cidade.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(item);
});

app.delete('/cidades/:id', async (req, res) => {
  const cidade = await Cidade.findById(req.params.id);
  await Cidade.findByIdAndDelete(req.params.id);
  const estado = await Estado.findById(cidade.estado);
  estado.cidades.pull(cidade);
  await estado.save();
  res.send({ message: 'Removido com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
