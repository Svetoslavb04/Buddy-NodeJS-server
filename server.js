const express = require('express');
const app = express();

require('dotenv').config();

const axios = require('axios').default;

const port = process.env.PORT

app.use(require('cors')())

app.use(require('./src/router'));

const { connectDatabase } = require('./src/config/initDatabase');

connectDatabase
    .then(() => {

        console.log('Database connection established.');

        app.listen(port, () => {
            console.log(`Server is listening on port: ${port}`);
        })

    })
    .catch((err) => {
        console.log('Failed to connect to database:');
        console.log(err);
    })

app.get('/token', async (req, res) => {

    try {
        const response = await axios.post(
            'https://ob.nordigen.com/api/v2/token/new/',
            JSON.stringify({
                secret_id: "",
                secret_key: ""
            }),
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )

        token = response.data.access;

        res.json(response.data);

    } catch (error) {
        res.status(error.status).json(error)
    }

})

app.get('/institutions', async (req, res) => {

    try {
        const response = await axios.get(
            'https://ob.nordigen.com/api/v2/institutions/?country=bg',
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        res.json(response.data);

    } catch (error) {
        console.log(error.response.data);
        res.status(401).json(error.response.data)
    }

})

const bankId = 'REVOLUT_REVOGB21';
const id = '4395a424-cd1e-4c6f-8ac4-1b41c3d008e3';

app.post('/requisitions', async (req, res) => {

    try {
        const response = await axios.post(
            'https://ob.nordigen.com/api/v2/requisitions/',
            JSON.stringify({
                'redirect': 'http://localhost:3000',
                'institution_id': 'REVOLUT_REVOGB21',

            }),
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        token = response.data.access;

        res.json(response.data);

    } catch (error) {
        res.status(error.status).json(error)
    }

});

app.get('/requisitions', async (req, res) => {

    try {
        const response = await axios.get(
            'https://ob.nordigen.com/api/v2/requisitions/4395a424-cd1e-4c6f-8ac4-1b41c3d008e3/',
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        res.json(response.data);

    } catch (error) {
        console.log(error.response.data);
        res.status(401).json(error.response.data)
    }

})

app.get('/accounts', async (req, res) => {

    try {
        const response = await axios.get(
            'https://ob.nordigen.com/api/v2/accounts/2001898f-97f9-4b10-b6fa-7443312c4239/balances',
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        res.json(response.data);

    } catch (error) {
        console.log(error.response.data);
        res.status(401).json(error.response.data)
    }

})