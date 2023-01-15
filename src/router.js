const router = require('express').Router();

router.use('/open-banking', require('./controllers/openBankingController'))

module.exports = router;