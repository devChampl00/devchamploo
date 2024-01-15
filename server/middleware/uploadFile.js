const multer = require('multer')
const crypto = require('crypto')

const TYPE_IMAGE = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'public/uploads')
  },
  filename(req, file, callback) {
    const uuid = crypto.randomUUID()
    const ext = TYPE_IMAGE[file.mimetype]
    callback(null, `${uuid}.${ext}`)
  }
})

const fileFilter = (req, file, callback) => {
  const acceptMime = Object.keys(TYPE_IMAGE)

  if (!acceptMime.includes(file.mimetype)) {
    callback({ message: 'File format not accepted' }, false)
  }

  callback(null, true)
}

const maxSize = 2 * 1024 * 1024 //2 MB
const uploadFile = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single('image')
module.exports = { uploadFile, TYPE_IMAGE }
