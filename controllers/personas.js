const personasRouter = require('express').Router()
const Persona = require('../models/persona')

personasRouter.get('/', (request, response) => {
  Persona.find({}).then((persona) => {
    response.json(persona)
  })
})

personasRouter.post('/', (request, response, next) => {
  const { body } = request

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const persona = new Persona({
    name: body.name,
    number: body.number || 0,
  })

  persona.save()
    .then((savedPersona) => {
      response.json(savedPersona)
    })
    .catch((error) => next(error))
})

personasRouter.get('/:id', (request, response) => {
  Persona.findById(request.params.id)
    .then((persona) => {
      if (persona) {
        response.json(persona)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

personasRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body
  Persona.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPersona) => {
      response.json(updatedPersona)
    })
    .catch((error) => next(error))
})

personasRouter.delete('/:id', (request, response, next) => {
  Persona.findByIdAndDelete(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})


module.exports = personasRouter