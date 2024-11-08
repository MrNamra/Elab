const mongoose = require('mongoose')
require('dotenv').config()

const mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL, {})

const db = mongoose.connection
db.once('error', (err) => console.log('Database Error: ', err))
db.on('connected', () => console.log("Connected to Database successfully"))
db.on('disconnected', () => console.log("Database Disconnected"))

module.exports = db