const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'testkey')
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if ( !user ) {
      throw Error('User not found.')
    }

    req.token = token
    req.user = user
    next()
  } catch (error) {
    console.log(error);

    return res.send({ error: 'Not authenticated'})
  }
}

module.exports = auth