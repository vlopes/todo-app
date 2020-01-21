const mongoose = require('mongoose')

mongoose.connect('mongodb://mongodb:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})
