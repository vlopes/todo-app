const { Router } = require('express')
const Task = require('../models/task')

const router = new Router()

router.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body)

  try {
    const task = await newTask.save()

    return res.send(task)
  } catch (err) {
    return res.status(400).send(err)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    return res.send(tasks)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const id = req.params.id

  try {
    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).send('Task not found.')
    }

    return res.send(task)
  } catch (error) {
    return res.status(500).send(err)
  }
})

router.patch('/tasks/:id', async (req, res) => {
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

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    return res.send(task)
  } catch (error) {
    return res.status(500).send()
  }
})

module.exports = router