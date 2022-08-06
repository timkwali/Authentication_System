const express = require('express')
const router = express.Router()
const { home, register, login, logout, getListOfUsers, getLoggedInUser, updateUser, resetPassword, updatePassword } = require('../controllers/authenticationController')
const auth = require("../middleware/auth");

router.get('/', home)
router.post('/register', register)
router.post('/login', login)
router.delete('/logout', auth, logout)
router.get('/userList', auth, getListOfUsers)
router.get('/loggedInUser', auth, getLoggedInUser)
router.put('/updateUser', auth, updateUser)
router.post('/resetPassword', auth, resetPassword)
router.post('/updatePassword', auth, updatePassword)

module.exports = router