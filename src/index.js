const express = require('express')
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
  const newUser = new User(req.body)

  newUser.save()
    .then((user) => {
      return res.send(user)
    })
    .catch((err) => {
      return res.status(400).send(err)
    })
})

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      return res.send(users)
    })
    .catch((err) => {
      return res.status(400).send(err)
    })
})

app.get('/users/:id', (req, res) => {
  const id = req.params.id

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found.')
      }

      return res.send(user)
    })
    .catch((err) => {
      return res.status(400).send(err)
    })
})

app.post('/tasks', (req, res) => {
  const newTask = new Task(req.body)

  newTask.save()
    .then((task) => {
      return res.send(task)
    })
    .catch((err) => {
      return res.status(400).send(err)
    })
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
