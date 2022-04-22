require('dotenv').config();
const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');
const uri = process.env.DB_URI;

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
