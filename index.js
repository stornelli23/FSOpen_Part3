require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require('cors');
const Persona = require('./models/persona')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json());

morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

//////////////// HTTP METHODS ////////////////

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Persona.find({}).then(persona => {
    response.json(persona)
  })
});

app.get("/api/persons/:id", (request, response) => {
  Persona.findById(request.params.id)
  .then(persona => {
    if (persona) {
      response.json(persona)
    } else {
      response.status(404).end() 
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
});

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  // const persona = {
  //   name: body.name,
  //   number: body.number,
  // }

  Persona.findByIdAndUpdate(
      request.params.id,
      {name, number},
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPersona => {
      response.json(updatedPersona)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Persona.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const persona = new Persona({
    name: body.name,
    number: body.number || 0,
  })

  persona.save()
    .then(savedPersona => {
     response.json(savedPersona)
    })
    .catch(error => next(error))
})

//////////////// SOME MIDDLEWARES ////////////////

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// This has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
