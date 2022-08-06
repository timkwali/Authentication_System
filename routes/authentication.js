const express = require('express')
const router = express.Router()
const { home, register, login, getListOfUsers } = require('../controllers/authenticationController')
const auth = require("../middleware/auth");

router.get('/', home)
router.post('/register', register)
router.post('/login', login)
router.get('/userList', auth, getListOfUsers)

module.exports = router