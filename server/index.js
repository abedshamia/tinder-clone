const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');
const uri =
  'mongodb+srv://abedshamia:0597997119abed@cluster0.duoa4.mongodb.net/Cluster0?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const returnedUsers = await users.find().toArray();
    res.send(returnedUsers);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
