const { Router } = require('express')
const User = require('../models/user')
const authMiddleware = require('../middleware/auth')

const router = new Router()

router.post('/users', authMiddleware, async (req, res) => {
  const newUser = new User(req.body)

  try {
    const user = await newUser.save()

    const token = await user.generateAuthToken()

    return res.send({ user, token })
  } catch (err) {
    return res.status(500).send(err)
  }
})

// router.get('/users', authMiddleware, async (req, res) => {
//   try {
//     const users = await User.find({})

//     return res.send(users)
//   } catch (err) {
//     return res.status(500).send(err)
//   }
// })

router.get('/users/profile', authMiddleware, async (req, res) => {
  return res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).send('User not found.')
    }

    return res.send(user)
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.patch('/users/:id', async (req, res) => {
  const allowUpdate = ['name', 'email', 'password', 'age']
  const udpates = Object.keys(req.body)
  const isValidOperation = udpates.every((update) => allowUpdate.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update'
    })
  }

  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).send({})
    }

    udpates.forEach((update) => user[update] = req.body[update])
    await user.save()

    return res.send(user)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).send()
    }

    return res.send(user)
  } catch (error) {
    return res.status(500).send()
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()

    return res.send({ user, token })
  } catch (error) {
    return res.status(400).send(error)
  }

})

module.exports = router