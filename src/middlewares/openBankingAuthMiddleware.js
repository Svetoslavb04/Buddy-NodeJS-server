const { getNewToken, refreshAccessToken } = require('../services/openBankingService');

let accessToken = null;
let refreshToken = null;

exports.getNordigenAccessToken = () => {
    return accessToken
}

exports.ServerAuthorized = async (req, res, next) => {
    
    if (!refreshToken) {
        try {
            const { access, refresh, access_expires, refresh_expires } = await getNewToken()

            setTimeout(() => { accessToken = null; }, access_expires - 400);
            setTimeout(() => { refreshToken = null; }, refresh_expires - 400);

            accessToken = access;
            refreshToken = refresh;

            req.accessToken = access;

            return next()

        } catch (error) {
            return res.json(error.message)
        }
    } else if (!accessToken) {

        try {

            const { access, access_expires } = await refreshAccessToken(refreshToken);

            setTimeout(() => { accessToken = null; }, access_expires - 400);

            accessToken = access;
            
            req.accessToken = access;

            return next()

        } catch (error) {
            return res.json(error.message)
        }
    }

    next()
}