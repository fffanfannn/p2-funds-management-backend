const express = require("express");
const router = express.Router();

//get users json api;  router: api/users
router.get("/users", (req, res) => {
    res.json({ msg: "users.js works"});
});

module.exports = router;