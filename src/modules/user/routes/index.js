// user routes here
const express = require("express")

const router = express.Router();

const { User } = require("../model/index")

router.get("/", async (req, res) => {
  let users = await User.findAll()
  return res.send({
    users
  })
})

module.exports = router;