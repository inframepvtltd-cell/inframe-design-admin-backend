const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { adminModel } = require('../model/adminModel')


const adminUserLogin = async (req, res) => {
    const { admin_userEmail, admin_userPassword } = req.body
    console.log('controller is hitting',admin_userEmail, admin_userPassword)

    try {
        const userCheck = await adminModel.findOne({ admin_userEmail })

        if (userCheck) {
            const decodedPassword = await bcrypt.compare(admin_userPassword, userCheck.admin_userPassword)
            if (decodedPassword) {
                const token = jwt.sign({ admin_userEmail }, process.env.TOKENKEY)
                res.send({
                    status: 1,
                    msg: 'Successfully Logged In',
                    token
                })
            }
            else {
                res.send({
                    status: 0,
                    msg: 'Invalid Email or Password',
                })
            }
        }
        else {
            res.send({
                status: 0,
                msg: 'Invalid Email or Password',
            })
        }
    }
    catch (error) {
        res.send({
            status: 0,
            msg: 'Something went wrong, please try again later',
            error
        })
    }
}


module.exports = { adminUserLogin }