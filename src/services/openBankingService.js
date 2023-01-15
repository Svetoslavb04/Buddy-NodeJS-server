const axios = require('axios').default;

const { baseURL } = require('../config/nordigenConfig');
const openBanking = require('../middlewares/openBankingAuthMiddleware');

exports.getNewToken = async () => {
    try {
        const response = await axios.post(
            `${baseURL}/token/new/`,
            JSON.stringify({
                secret_id: process.env.NORDIGEN_SECRET_ID,
                secret_key: process.env.NORDIGEN_SECRET_KEY
            }),
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )

        return {
            access: response.data.access,
            access_expires: response.data.access_expires,
            refresh: response.data.refresh,
            refresh_expires: response.data.refresh_expires
        }

    } catch (error) {
        throw new Error('Unauthorized access to the Open Banking Provider.')
    }
}

exports.refreshAccessToken = async (refreshToken) => {

    try {
        const response = await axios.post(
            `${baseURL}/token/refresh/`,
            JSON.stringify({
                refresh: refreshToken
            }),
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )

        return {
            access: response.data.access,
            access_expires: response.data.access_expires
        }

    } catch (error) {
        throw new Error('Unauthorized access to the Open Banking Provider.')
    }
}

exports.getInstitutionsByCountry = async (countryCode) => {

    try {

        const response = await axios.post(
            `${baseURL}/institutions?country=${countryCode}`,
            null,
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${openBanking.getNordigenAccessToken()}`
                }
            }
        )
        
        return response.data

    } catch (error) {
        throw error.response.data
    }
}