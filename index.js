const express = require('express');
const app = express();

const { MongoClient } = require('mongodb')
const connectionUrl = 'mongodb://mongodb:27017'
const databaseName = 'task-manager'
let db

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err);
  }

  db = client.db(databaseName)
})


app.get('/', function (req, res) {
  db.collection('tasks').insertMany([
    {
      description: 'First task',
      completed: false
    },
    {
      description: 'Second task',
      completed: false
    },
    {
      description: 'Third task',
      completed: true
    },

  ])

  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
