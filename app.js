require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const multer = require('multer')

const { uploadFile } = require('./server/middleware/uploadFile')
const checkFileType = require('./server/middleware/checkFileType')

const app = express()
const PORT = process.env.PORT || 3000

const connectDB = require('./server/config/db')
connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'kosongin',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
    // cookie: {maxAge: new Date(Date.now() + 3600000)}
    // Date.now() - 30 * 24 * 60 * 60 * 1000
  })
)

// Templating engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.set('views', __dirname + '/views')
app.use(express.static('public'))
// app.use(express.static(__dirname + 'public'))

// app.use(uploadFile, checkFileType)
app.use(uploadFile)
app.use('/', require('./server/routes/main'))

// app.use((err, req, res, next) => {
//   if (err instanceof multer.multerError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       err.message = 'Max file size is 1MB'
//     }
//     console.log(err)
//     res.status(500).json(err)
//   }

//   next()
// })

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

module.exports = app
