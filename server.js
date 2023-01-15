const express = require('express');
const app = express();

require('dotenv').config();

// const axios = require('axios').default;

const port = process.env.PORT

app.use(require('cors')())

app.use(require('./src/router'));

const { connectDatabase } = require('./src/config/initDatabase');

const run = async () => {

    try {

        await connectDatabase()
        console.log('Database connection established.');
        
        app.listen(port, () => {
            console.log(`Server is listening on port: ${port}`);
        })

    } catch (err) {
        console.log('Failed to connect to database:');
        console.log(err);
    }

}

run()