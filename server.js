const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000

app.use(require('cors')({
    origin: process.env.ORIGIN,
    credentials: true
}))

const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
        httpOnly: true
    },
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION_STRING, dbName: 'Budggy' })
}

if (process.env.ENVIRONMENT !== 'development') {
    app.set('trust proxy', 1)
    sessionSettings.cookie.secure = true
    sessionSettings.cookie.sameSite = 'none'
}

app.use(session(sessionSettings))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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