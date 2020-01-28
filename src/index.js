const express = require('express')
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
  const newUser = new User(req.body)

  try {
    const user = await newUser.save()

    return res.send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    return res.send(users)
  } catch (err) {
    return res.status(400).send(err)
  }
})

app.get('/users/:id', async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).send('User not found.')
    }

    return res.send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

app.patch('/users/:id', async (req, res) => {
  const allowUpdate = ['name', 'email', 'password', 'age']
  const udpates = Object.keys(req.body)
  const isValidOperation = udpates.every((update) => allowUpdate.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update'
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).send({})
    }

    return res.send(user)
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body)

  try {
    const task = await newTask.save()

    return res.send(task)
  } catch (err) {
    return res.status(400).send(err)
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    return res.send(tasks)
  } catch (error) {
    return res.status(400).send(error)
  }
})

app.get('/tasks/:id', async (req, res) => {
  const id = req.params.id

  try {
    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).send('Task not found.')
    }

    return res.send(task)
  } catch (error) {
    return res.status(400).send(err)
  }
})

app.patch('/tasks/:id', async (req, res) => {
  const allowUpdate = ['completed', 'description']
  const udpates = Object.keys(req.body)
  const isValidOperation = udpates.every((update) => allowUpdate.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update'
    })
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!task) {
      return res.status(404).send({})
    }

    return res.send(task)
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
