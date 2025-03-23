const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
const ConnectDB = require('./src/config/db');

require('./src/config/dotenv')
frontend_url = process.env.FRONTEND_URL


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: frontend_url,
    credentials: true
}))




ConnectDB()

app.get('/', (req, res) => {
    res.status(200).send(`Backend is running successfully`)
})






const UserRouter = require('./src/routes/UserRoutes')
const StorageRouter = require('./src/routes/StorageRoutes')
const SecureFolderRouter = require('./src/routes/SecureFolderRoute')




app.use('/api/auth', UserRouter)
app.use('/api', StorageRouter)
app.use('/api', SecureFolderRouter)










module.exports = app














