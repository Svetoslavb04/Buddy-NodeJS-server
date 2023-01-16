const router = require('express').Router()

const isAuthenticated = require('../middlewares/isAuthenticated')

const { register, login } = require('../services/authService')

router.get('/me', async (req, res) => { res.json(req.session.user || { _id: null }) })

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 400, message: 'Email and password are required' })
    }

    try {

        const user = await login(email, password);

        req.session.regenerate(function (err) {
            if (err) return res.json(err)

            req.session.user = user

            res.json(user)
        })

    } catch (error) {

        res.status(401).json(error)

    }
})

router.post('/register', async (req, res) => {

    const { email, username, password } = req.body;

    try {

        const user = await register(email, username, password);

        req.session.regenerate(function (err) {
            if (err) return res.json(err)

            req.session.user = user

            res.json(user)
        })

    } catch (error) {

        res.status(400).json({ status: 400, ...error });

    }

})

router.get('/logout', isAuthenticated, (req, res) => {

    console.log(req.session);
    req.session.user = null

    res.json({ message: 'Logged out' })

})

module.exports = router