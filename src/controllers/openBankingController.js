const router = require('express').Router();

const { ServerAuthorized, getNordigenAccessToken } = require('../middlewares/openBankingAuthMiddleware');

router.use(ServerAuthorized);

router.get('/countries', (req, res) => {
    
    const accessToken = getNordigenAccessToken();

    res.json(accessToken)
})

module.exports = router;