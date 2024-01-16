const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtsecret = process.env.JWT_SECRET

// Register
const registerPage = (req, res) => {
  res.render('register')
}
const registerPost = async (req, res) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      console.log(username, hashedPassword)
      const user = await User.create({ username, password: hashedPassword })

      res.status(201).json({ message: 'New user has created', user })
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already in use' })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
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

module.exports = { loginPage, loginPost, logout }
