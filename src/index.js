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
      res.send(user)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

app.post('/tasks', (req, res) => {
  const newTask = new Task(req.body)

  newTask.save()
    .then((task) => {
      res.send(task)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
