const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json());
morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))




let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
  response.send("<h1>Helloooo World!</h1>");
});

app.get("/info", (req, res) => {
  const personsLength = persons.length;
  const resTime = new Date()
  res.send(`<p>Phonebook has info for ${personsLength} people</p><p>${resTime}</p>`)
})

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});


const generateRandomId = () => {
  const min = persons.length + 1;
  const max = 1000000;
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const alreadyExist = persons.some(person => person.name === body.name);
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    });
  }
  
  if (alreadyExist) {
    return response.status(400).json({ 
      error: 'name already exists' 
    });
  }
  
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    });
  }
  

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId(),
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
