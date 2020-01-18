const express = require('express');
const app = express();

const { MongoClient, ObjectID } = require('mongodb')
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
  db.collection('tasks').updateMany(
    {
      completed: false
    },
    {
      $set: {
        completed: true
      }
    }
  ).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  })

  return res.send('Hello World!');
});

app.get('/all', async function (req, res) {
  const tasks = await db.collection('tasks').find().toArray()

  return res.send(tasks)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
