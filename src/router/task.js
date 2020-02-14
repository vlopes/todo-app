const { Router } = require('express')
const Task = require('../models/task')
const authMiddleware = require('../middleware/auth')

const router = new Router()

router.post('/tasks', authMiddleware, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    const task = await newTask.save()

    return res.send(task)
  } catch (err) {
    return res.status(400).send(err)
  }
})

router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const match = {}

    if (req.query.completed) {
      match.completed = req.query.completed === 'true'
    }

    await req.user.populate({
      path: 'tasks',
      match
    }).execPopulate()

    const tasks = req.user.tasks

    return res.send(tasks)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.get('/tasks/:id', authMiddleware, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send('Task not found.')
    }

    return res.send(task)
  } catch (error) {
    return res.status(500).send(err)
  }
})

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  const allowUpdate = ['completed', 'description']
  const udpates = Object.keys(req.body)
  const isValidOperation = udpates.every((update) => allowUpdate.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update'
    })
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    udpates.forEach((update) => task[update] = req.body[update])
    task.save()

    return res.send(task)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    return res.send(task)
  } catch (error) {
    return res.status(500).send()
  }
})

module.exports = router