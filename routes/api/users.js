const express = require("express");
const router = express.Router();

//db connection
const { MongoClient, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://2295467:ZhQhH6EHy24jWLMa@cluster0.zvckhsd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("mongodemo");
const users = database.collection("users");

//get user register api;  router: api/user/register

router.post("/register", (req, res) => {
    const client = new MongoClient(uri);
     async function run() {
       try {
           const resultName = await users.findOne({ name: req.body.name });
           const resultEmail = await users.findOne({ email: req.body.email });
           if (resultName || resultEmail || (resultName && resultEmail)) {
             return res.status(400).send({ RegisterNote: "Username or email already exists" });
           } else {
             const result = await users.insertOne(req.body);
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

//get user register login;  router: api/user/login
router.post("/login", (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
      try {
      const name = req.body.name;
      const password = req.body.password;
      const userExist = await users.findOne({ name: name });
      if (!userExist) {
        return res.status(400).json({ errMsg: "User not exist" });
      } else {
          if (userExist.password !== password) { 
            return res.status(400).json({ errMsg: "Password not match" });
          } else { 
              res.json(userExist);
          }
      }
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
});

module.exports = router;