const express = require("express");
const app = express();
const port = 3000;

//cors
const cors = require("cors");
app.use(cors());

//parse application/json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//db connection
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://2295467:ZhQhH6EHy24jWLMa@cluster0.zvckhsd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("mongodemo");
const student = database.collection("student");

//users api
const userRouter = require("./routes/api/users");
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  async function run() {
    try {
      const result = await student.find({}).toArray();
      console.log(result);
      res.send(result);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
