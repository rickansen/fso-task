const { request, response } = require('express');
const { addListener } = require('nodemon');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;
let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to homepage');
});

app.get('/api/persons', (req, res) => {
  res.send(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
  const param = Number(req.params.id);
  const find = phonebook.find((el) => el.id === param);

  if (!find) res.status(404);

  res.send(find);
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${phonebook.length} people
  ${new Date()}`);
});

app.delete('/api/persons/:id', (req, res) => {
  const param = Number(req.params.id);
  phonebook = phonebook.filter((el) => el.id !== param);

  res.status(204).end();
  console.log(`deleted id:${param}`);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const id = Math.ceil(Math.random() * 100);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing Field',
    });
  }

  if (
    phonebook.find((el) => el.name === body.name && el.number === body.number)
  ) {
    return res.status(400).json({
      error: 'name and number must be unique',
    });
  } else if (
    phonebook.find((el) => el.name === body.name || el.number === body.number)
  ) {
    const data = phonebook.find((el) => el.name === body.name)
      ? 'name'
      : 'number';
    return res.status(400).json({
      error: `${data} must be unique`,
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  };
  console.log(`${person.id} added`);
  phonebook = phonebook.concat(person);

  res.json(person);
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
