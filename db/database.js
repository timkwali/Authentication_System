const mongoose = require('mongoose')
require('dotenv').config()
const { MONGO_URI } = process.env

//Async mongoose connection
const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('MongoDb connected...')
        //Seed data
    } catch (err) {
        console.error("error------->" + err.message)
        //Exit with Failure
        process.exit(1)
    }
}

module.exports = connectDb;