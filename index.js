const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dkmkvf0.mongodb.net/?retryWrites=true&w=majority`;
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
// app.use(bodyParser.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/sleep-count", (req, res) => {
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
            const database = client.db(process.env.DB_NAME);
      const sleepCount = database.collection(process.env.DB_COLLECTION);

        const cursor = sleepCount.find({});
        const allValues = await cursor.toArray();
        // console.log(allValues);
        res.send(allValues)
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
});

app.post("/sleep-count/add", (req, res) => {
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const database = client.db(process.env.DB_NAME);
      const sleepCount = database.collection(process.env.DB_COLLECTION);

     const result = await sleepCount.insertOne(req.body);
     if (result.insertedId){
      res.send(`Sleep record added to database successfully, Sleep Record ID:${result.insertedId}`)
     }
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
});

app.listen(port, () => {
  console.log(`Driver Monitoring Sever is listening on port ${port}`);
});
