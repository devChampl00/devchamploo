const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtsecret = process.env.JWT_SECRET

// Register
const registerPage = (req, res) => {
    res.render('register', { layout: false })
}
const registerPost = async (req, res) => {
    try {
        const { fullname, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = await User.create({ fullname, username, password: hashedPassword })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'Something trouble, please try again' })
            }
            res.status(500).json({ message: 'Internal server error' })
        }

        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
}

// Login
const loginPage = (req, res) => {
    if (req.cookies.token) {
        res.redirect('/dashboard')
    } else {
        res.render('login', { layout: false })
    }
}

const loginPost = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong password' })
        }

        const token = jwt.sign({ userId: user._id }, jwtsecret)
        res.cookie('token', token, { httpOnly: true })

        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
}

// Logout
const logout = (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
}

module.exports = { registerPage, registerPost, loginPage, loginPost, logout }
