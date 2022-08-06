const express = require('express')
const router = express.Router()
const { home, register, login, logout, getListOfUsers, getLoggedInUser, updateUser } = require('../controllers/authenticationController')
const auth = require("../middleware/auth");

router.get('/', home)
router.post('/register', register)
router.post('/login', login)
router.delete('/logout', auth, logout)
router.get('/userList', auth, getListOfUsers)
router.get('/loggedInUser', auth, getLoggedInUser)
router.put('/updateUser', auth, updateUser)

module.exports = router