const router = require('express').Router();

const { ServerAuthorized } = require('../middlewares/openBankingAuthMiddleware');
const { getInstitutionsByCountry } = require('../services/openBankingService');

router.use(ServerAuthorized);

router.get('/institutions', async (req, res) => {
    
    const { country } = req.query;

    if (!country) { return res.json([]) }
    
    try {

        const institutions = await getInstitutionsByCountry(country.toLowerCase());
        
        res.json(institutions)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;