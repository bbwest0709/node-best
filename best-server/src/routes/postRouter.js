const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send(`<h1>Post</h1>`)
})

module.exports = router;