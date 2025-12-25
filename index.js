
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const { adminRoute } = require('./routes/adminRoutes')
const { adminModel } = require('./model/adminModel')
const connectDB = require('./config/dbConnect')

dotenv.config()
const app = express()

// ✅ 1. CORS FIRST
app.use(cors({

    origin: [
        'http://localhost:3000',
        'https://dashboard.inframedesigninstitute.com'
    ], // frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

// ✅ 2. Body parser
app.use(express.json())

// ✅ 3. Routes
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
    res.send('backend is live')
})

connectDB().then(async () => {
    const adminExist = await adminModel.find()
    if (adminExist.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10)
        await adminModel.insertOne({
            admin_userEmail: "admin@123",
            admin_userPassword: hashedPassword
        })
    }

    app.listen(process.env.PORT || 8200, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${process.env.PORT}`)
    })
})
