require('dotenv').config();
const express = require('express');
const {MongoClient} = require('mongodb');
const {v1: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const uri = process.env.DB_URI;

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri);

  const {email, password} = req.body;

  const generatedUserId = uuidv4();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const isExist = await users.findOne({email});

    if (isExist) {
      return res.status(400).send('User already exist, Please login');
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign(insertedUser, process.env.JWT_SECRET, {expiresIn: 60 * 24});

    res.status(201).json({token});
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
});

app.post('/login', async (req, res) => {
  const client = new MongoClient(uri);
  const {email, password} = req.body;
  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const user = await users.findOne({email});

    const correctPassword = await bcrypt.compare(password, user.password);

    if (user && correctPassword) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: 60 * 24});

      res.status(201).json({token});
    }

    res.status(400).send('Invalid Credentials');
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
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
