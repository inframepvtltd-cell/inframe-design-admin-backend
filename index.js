const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { adminRoute } = require('./routes/adminRoutes')
const { adminModel } = require('./model/adminModel')
const connectDB = require('./config/dbConnect')

dotenv.config()
const app = express()

const isProduction = process.env.NODE_ENV === 'production'
const corsWhiteList = isProduction
  ? ['https://dashboard.inframedesigninstitute.com']
  : ['http://localhost:3000', 'https://dashboard.inframedesigninstitute.com']

app.use(cors({
    origin: corsWhiteList,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

app.use(express.json())

app.use('/admin', adminRoute)

app.get('/', (req, res) => res.send('Backend is live with cicd'))

connectDB().then(async () => {
    const adminExist = await adminModel.find()
    if (adminExist.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10)
        await adminModel.insertOne({
            admin_userEmail: "admin@123",
            admin_userPassword: hashedPassword
        })
    }

    const PORT = process.env.PORT || 8200
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`)
    })
})