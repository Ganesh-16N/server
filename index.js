
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI =process.env.URI;

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB using Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();
app.use(express.json());

app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// 

