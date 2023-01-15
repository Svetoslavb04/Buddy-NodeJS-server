const router = require('express').Router()

const isAuthenticated = require('../middlewares/isAuthenticated')

router.post('/login', (req, res) => {

})

router.post('/register', (req, res) => {

})

router.get('/logout', isAuthenticated, (req, res) => {
})

module.exports = router