const { Router } = require('express')
const User = require('../models/user')
const authMiddleware = require('../middleware/auth')
const multer = require('multer')
const upload = multer({
  dest: '/app/src/avatars/',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return cb(new Error('File in wrong format, only accept jpg, jpeg or png files.'))
    }

    return cb(undefined, true)
  }
})

const router = new Router()

router.post('/users', async (req, res) => {
  const newUser = new User(req.body)

  try {
    const user = await newUser.save()

    const token = await user.generateAuthToken()

    return res.status(201).send({ user, token })
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.get('/users/profile', authMiddleware, async (req, res) => {
  return res.send(req.user)
})

router.patch('/users/me', authMiddleware, async (req, res) => {
  const allowUpdate = ['name', 'email', 'password', 'age']
  const udpates = Object.keys(req.body)
  const isValidOperation = udpates.every((update) => allowUpdate.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update'
    })
  }

  try {
    udpates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()

    return res.send(req.user)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.delete('/users/me', authMiddleware, async (req, res) => {
  try {
    await req.user.remove()
    return res.send(req.user)
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

router.post('/users/logout', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    })
    await req.user.save()

    return res.send('Logged out.')
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    return res.send('Logged out from all devices.')
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
  console.log(req);

  return res.send()
})

module.exports = router