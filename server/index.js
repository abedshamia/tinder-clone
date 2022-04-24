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

    res.status(201).json({token, userId: generatedUserId});
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

      return res.status(201).json({token, userId: user.user_id});
    }

    res.status(400).send('Invalid Credentials');
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
});

app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = {gender_identity: {$eq: gender}};
    const foundUsers = await users.find(query).toArray();
    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

app.get('/user', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const user = await users.findOne({user_id: userId});

    res.send(user);
  } finally {
    await client.close();
  }
});

app.put('/user', async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = {user_id: formData.user_id};

    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
      },
    };

    const insertedUser = await users.updateOne(query, updateDocument);
    res.status(200).send(insertedUser);
  } finally {
    await client.close();
  }
});

app.put('/addmatch', async (req, res) => {
  const client = new MongoClient(uri);
  const {userId, matchedUserId} = req.body;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const query = {user_id: userId};
    const updateDocument = {
      $push: {matches: {user_id: matchedUserId}},
    };

    const user = await users.updateOne(query, updateDocument);

    res.send(user);
  } finally {
    await client.close();
  }
});

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const pipeLine = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    const foundUsers = await users.aggregate(pipeLine).toArray();
    console.log(foundUsers);
    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
