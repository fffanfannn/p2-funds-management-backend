const express = require("express");
const router = express.Router();

//db connection
const { MongoClient, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://2295467:ZhQhH6EHy24jWLMa@cluster0.zvckhsd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("mongodemo");
const users = database.collection("users");


var passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password",
    },
    async function (name, password, done) {
      console.log('a');
      const user = await users.findOne({ name: name });
      console.log('aaaaaa', user);
      if (!user) {
        return done(null, false, { message: "Invalid username..." });
      }

      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password..." });
      }

      return done(null, user);
    })
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
  console.log('bbbb', user);
});

passport.deserializeUser(async function (id, done) {
  console.log('ccccc');
  await users.findById(id, function (err, user) {
    done(err, user);
  });
});



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

router.post("/login", (req, res, next) => {
  console.log("Received request:", req.body);
  passport.authenticate("local", (err, user, info) => {
    console.log("Error:", err);
    console.log("User:", user);
    console.log("Info:", info);

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ errMsg: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log('/login: req.isAuthenticated()', req.isAuthenticated())
      return res.json(user);
    });
  })(req, res, next);

});

// router.post("/login", (req, res) => {
//   const client = new MongoClient(uri);
//   async function run() {
//       try {
//       const name = req.body.name;
//       const password = req.body.password;
//       const userExist = await users.findOne({ name: name });
//       if (!userExist) {
//         return res.status(400).json({ errMsg: "User not exist" });
//       } else {
//           if (userExist.password !== password) { 
//             return res.status(400).json({ errMsg: "Password not match" });
//           } else { 
//               res.json(userExist);
//           }
//       }
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);
// });


//get user logout;  router: api/user/logout

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Redirect or respond as needed after logout
    res.redirect("/"); // You can redirect to a different page if needed
  });
  console.log('/logout: req.isAuthenticated()', req.isAuthenticated())
});

//get users list;  router: api/user/list

router.get("/list", (req, res) => {

  const client = new MongoClient(uri);
  async function run() {
    try {
      const result = await users.find({}).toArray();
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

//post user tags by id api;  router: api/user/tags/:id

router.post("/tags/:id", (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const result = await users.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: (req.body) }
      );
      if (result.modifiedCount == 0) {
        return res.status(400).json({ msg: "No item modified" });
      } else {
        res.json(result);
      }
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

//get user tags by id api;  router: api/user/tags/:id

router.get("/tags/:id", (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const result = await users.find(
        { _id: new ObjectId(req.params.id) },
      ).toArray();
      if (result.modifiedCount == 0) {
        return res.status(400).json({ msg: "No item modified" });
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