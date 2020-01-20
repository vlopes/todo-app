const mongoose = require('mongoose')

mongoose.connect('mongodb://mongodb:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})

const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    required: true
  },

  completed: {
    type: Boolean,
    default: false
  }
})
