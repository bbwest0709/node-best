const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/', (req, res) => {
    res.send(`<h1>Admin</h1>`)
})

router.get('/users', adminController.getUserList);

module.exports = router;