// user routes here
const express = require("express")

const router = express.Router();

router.get("/", (req, res) => {
  return res.send({
    users: "All users"
  })
})

module.exports = router;