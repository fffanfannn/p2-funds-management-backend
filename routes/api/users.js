const express = require("express");
const router = express.Router();

//db connection
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://2295467:ZhQhH6EHy24jWLMa@cluster0.zvckhsd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("mongodemo");
const student = database.collection("student");

//get users json api;  router: api/user/register
router.get("/", (req, res) => {
    res.json({ msg: "users.js works"});
});

router.post("/register", (req, res) => {
    const client = new MongoClient(uri);
     async function run() {
       try {
           const userExist = await student.findOne({ name: req.body.name });
           if (userExist) {
             return res.status(400).json({ name: "User already exists" });
           } else {
             const result = await student.insertOne(req.body);
             console.log(result);
             res.send(result);
           }
       } finally {
         // Ensures that the client will close when you finish/error
         await client.close();
       }
     }
     run().catch(console.dir);
});

module.exports = router;