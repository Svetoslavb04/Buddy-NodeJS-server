const router = require('express').Router();

const isAuthenticated = require('../middlewares/isAuthenticated');
const { ServerAuthorized } = require('../middlewares/openBankingAuthMiddleware');

const { getInstitutionsByCountry, getRequisitionLink, setRequisitionToUser, getAccountsId, getFullAccountsInformation } = require('../services/openBankingService');

router.use(ServerAuthorized);
router.use(isAuthenticated);

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

router.get('/requisition', async (req, res) => {

    const { bankId } = req.query;

    if (!bankId) { return res.status(400).json('Please provide bank id') }

    try {

        const requisition = await getRequisitionLink(bankId);

        setRequisitionToUser(requisition.id, req.session.user._id)

        res.json({ link: requisition.link })
    } catch (error) {

        res.status(400).json(error)

    }
})

router.get('/accounts', async (req, res) => {

    try {

        const accounts = await getAccountsId(req.session.user._id);

        const fullAccountsInformation = await getFullAccountsInformation(accounts)
        console.log(accounts);
        res.json([...fullAccountsInformation]);
    } catch (error) {
        res.json([])
    }

})

module.exports = router;