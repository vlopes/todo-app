const express = require('express')
require('./db/mongoose')
const taskRouter = require('./router/task')
const userRouter = require('./router/user')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
