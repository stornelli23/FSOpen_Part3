const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://santiagostornelli:${password}@cluster0.as1i6gw.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personaSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persona = mongoose.model('Persona', personaSchema)

Persona
  .find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(persona => {
      console.log(persona.name + ' ' + persona.number)
    })
    mongoose.connection.close()
  })


