const axios = require('axios').default;

const Requistion = require('../models/Requisition');

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

exports.getRequisitionLink = async (bankId) => {

    try {

        const response = await axios.post(
            `${baseURL}/requisitions/`,
            JSON.stringify({
                'redirect': process.env.REDIRECT_URL,
                'institution_id': bankId,
            }),
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openBanking.getNordigenAccessToken()}`
                }
            }
        )

        return response.data

    } catch (error) {
        throw error.response.data
    }

}

exports.setRequisitionToUser = async (requisition, user_id) => {

    Requistion.create({
        requisition, user_id
    })

}

exports.getAccountsId = async (user_id) => {

    try {

        const requisitions = await Requistion.find({ user_id })

        const accounts = new Set();

        for (const r of requisitions) {

            try {

                const details = await this.getRequisitionDetails(r.requisition);
                details.accounts.forEach(a => accounts.add(a))

            } catch (error) { console.log(error) }

        }

        return accounts
    } catch (error) {
        console.log(error);
        return []
    }

}

exports.getRequisitionDetails = async (requistion) => {

    try {

        const response = await axios.get(
            `${baseURL}/requisitions/${requistion}`,
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${openBanking.getNordigenAccessToken()}`
                }
            }
        )

        return response.data

    } catch (error) {
        throw error.response?.data
    }

}

exports.getFullAccountsInformation = async (accounts) => {

    const fullAccountsInformation = [];

    try {

        for (const account of accounts) {

            const detailsResponse = await axios.get(
                `${baseURL}/accounts/${account}/details/`,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${openBanking.getNordigenAccessToken()}`
                    }
                }
            )

            const accountDetails = detailsResponse.data.account;
            
            const balancesResponse = await axios.get(
                `${baseURL}/accounts/${account}/balances/`,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${openBanking.getNordigenAccessToken()}`
                    }
                }
            )

            accountDetails.balances = balancesResponse.data.balances;

            const accountResponse = await axios.get(
                `${baseURL}/accounts/${account}/`,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${openBanking.getNordigenAccessToken()}`
                    }
                }
            )

            accountDetails.institution_id = accountResponse.data.institution_id;

            fullAccountsInformation.push(accountDetails);
        }


        return fullAccountsInformation

    } catch (error) {
        console.log(error);
        throw error.response?.data
    }
}