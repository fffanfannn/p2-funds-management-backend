const express = require("express");
const router = express.Router();

//db connection
const { MongoClient, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://2295467:ZhQhH6EHy24jWLMa@cluster0.zvckhsd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("mongodemo");
const accountCollection = database.collection("account");

//check account list;  router: api/account/list

router.get("/list", (req, res) => {
   const client = new MongoClient(uri);
   async function run() {
     try {
       const result = await accountCollection.find({}).toArray();
       if (result.length == 0) { 
          return res.status(400).json({ msg: "No list found" });
       } else {
          res.json(result);
       }
     } finally {
       await client.close();
     }
   }
   run().catch(console.dir);
});

//add items in account;  router: api/account/add
router.post("/add", (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
      try {
      const result = await accountCollection.insertOne( req.body );
      res.send(result)
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

//check account item with id;  router: api/account/:id

router.get("/:id", (req, res) => {
   const client = new MongoClient(uri);
   async function run() {
     try {
       const result = await accountCollection.findOne({
         _id: new ObjectId(req.params.id),
       });
       if (!result) {
         return res.status(400).json({ msg: "No item found" });
       } else { 
         res.json(result);
       }
      
     } finally {
       await client.close();
     }
   }
   run().catch(console.dir);
});

module.exports = router;