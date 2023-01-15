const router = require('express').Router();

router.use('/open-banking', require('./controllers/openBankingController'))
router.use('/user', require('./controllers/authController'))

module.exports = router;