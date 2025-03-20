const mongoose = require('mongoose')
require('./dotenv')
const uri = process.env.MONGO_URI

const ConnectDB = async () => {
    try {

        await mongoose.connect(uri)
        console.log("Connected to MongDB")

    } catch (error) {
        console.log(error)

        console.log("connection failed")
        process.exit(1)
    }
}

module.exports = ConnectDB